import { useAppDispatch } from "../useAppDispatch";
import { useAppSelector } from "../useAppSelector";
import { useCallback, useEffect, useRef } from "react";
import { getEloSettings } from "../../utils/getEloSettings";
import {
    initializeStockFishState,
    makeMove,
    updateStockFishReadystate,
    updateStockFishThinking
} from "../../features/chessGame/chessSlice";
import { PieceSymbol, Square } from "chess.js";

const limitStrength = true;
const stockFishDelay = 100;

export const useStockFish = ()=>{

    const dispatch = useAppDispatch();

    const workerRef = useRef<Worker | null>(null);
    const isInitializedRef = useRef(false);
    const loadedRef = useRef(false);


    const game = useAppSelector((state)=> state.chess.game);
    const gameState = useAppSelector((state)=> state.chess.gameState);
    const isSinglePlayer = useAppSelector((state)=> state.chess.isSinglePlayer);
    const player = useAppSelector((state)=> state.chess.player);
    const stockFishState = useAppSelector((state)=> state.chess.stockFishState);


    // const isEnabled = !!stockFishState; // Do Any Action if isEnabled.
    const elo = stockFishState?.elo ?? 1400;
    const ready = stockFishState?.flagReady ?? false;
    const thinking = stockFishState?.flagThinking ?? false;

    // Lazy load Stockfish
    const loadStockFish = useCallback(async () => {
        if(loadedRef.current || isInitializedRef.current) return;

        loadedRef.current = true;

        try {
            // workerRef.current = new Worker(
            //     new URL('/stockfish/stockfish-17-lite-single.js', import.meta.url),
            //     { type: 'module' }
            // );
            // Above code cause problem in production environment but working fine in local env.

            workerRef.current = new Worker('/stockfish/stockfish-17-lite-single.js', { type: 'module' });
            // workerRef.current = new Worker("/stockfish/stockfish-17-lite-single.js");

            // Set up message event handler for worker thread.
            workerRef.current.onmessage = (e)=>{
                handleStockfishMessage(e.data);
            };

            // Handle worker thread errors
            workerRef.current.onerror = (error) => {
                console.error("Stockfish worker error:", error);
                loadedRef.current = false;
            };

            // Initialize UCI protocol; (UCI handshake)
            workerRef.current.postMessage('uci');
            dispatch(initializeStockFishState());

            // Simulate ELO by mapping ELO to skill level;
            // workerRef.current.postMessage('set-option name skill level value'+ )
        } catch(error){
            console.error("Failed to load Stockfish: ",error);
            // Update it in slice with
            loadedRef.current = false;
        }
    },[]);


    const handleStockfishMessage = useCallback((message: string)=>{
        console.log(message);
        // if(message === "Stock Fish message Stockfish 17 Lite WASM by the Stockfish developers (see AUTHORS file)"){
        //     debugger;
        //     workerRef.current && workerRef.current.postMessage('uci');
        // }

        const [type, ...rest] = message.split(" ");

        switch (type){
            case "uciok":
                if(workerRef.current){
                    workerRef.current.postMessage('isready');
                }
                break;

            case 'readyok':
                if(workerRef.current && !isInitializedRef.current){
                    const settings = getEloSettings(elo);
                    workerRef.current.postMessage(`setoption name Skill Level value ${settings.depth}`);

                    // Optionally set other UCI options
                    if(limitStrength){
                        workerRef.current.postMessage(`setoption name UCI_LimitStrength value true`);
                        const stockFish = elo < 1350 ? elo : elo > 2850 ? 2850 : elo;
                        workerRef.current.postMessage(`setoption name UCI_Elo value ${stockFish}`);
                    }

                    // Set threads to 1 for web worker implementation.(WASM) and don't add extra load on web.
                    workerRef.current.postMessage("setoption name Threads value 1");

                    isInitializedRef.current = true;
                    dispatch(updateStockFishReadystate(true));

                }
                break;

            case "bestmove":{

                const bestMove = rest[0];
                dispatch(updateStockFishThinking(false));
                if(bestMove && bestMove !== "(none)" && game){
                    try{
                        // Parse move format e2e4 or e738q (promotion)
                        const from = bestMove.slice(0,2) as Square;
                        const to = bestMove.slice(2,4) as Square;
                        const promotion = bestMove.length > 4 ? bestMove.slice(4) as PieceSymbol : undefined;

                        // validate the move before dispactching
                        const moves = game.moves({verbose: true });
                        const validMove = moves.find(move =>
                            move.from == from &&
                            move.to == to &&
                            (promotion ? move.promotion === promotion : !move.promotion)
                        )

                        if(validMove){
                            dispatch(makeMove({from, to , promotion}))
                        }else{
                            console.error("Invalid move from Stockfish:", bestMove);
                        }
                    }catch(error){
                        console.error("Error parsing Stockfish move:", error);
                    }
                }
                break;
            }
        }

    },[]);


    // Autoload when single player mode is enabled.
   // On Single Player Mode only to save network Bandwidth
    useEffect(()=>{
        if(isSinglePlayer && !loadedRef.current){
            loadStockFish().then(()=>{
                // console.log("Stock Fish is initialized");
            });
        }
    });


    const requestSFMove = useCallback(async ()=>{
        if(!workerRef.current){
            await loadStockFish();
            if(!workerRef.current) return
        }

        if(!game || thinking) return;

        dispatch(updateStockFishThinking(true));

        const currentFen = game.fen();
        const settings = getEloSettings(elo);

        try{
            // Prepare for new game analysis
            workerRef.current.postMessage('ucinewgame');

            // Set position
            workerRef.current.postMessage(`position fen ${currentFen}`);

            // Start search with appropriate time/depth limits
            const searchCommand = settings.time ?
                `go movetime ${settings.time}` :
                `go depth ${settings.depth}`

            workerRef.current.postMessage(searchCommand);
            // Targeting both depth and time will make game too much hard. (Check which one is working)
            // workerRef.current.postMessage(`go depth ${settings.depth} time ${settings.time}`);
            // workerRef.current.postMessage(`go depth ${settings.depth} movetime ${settings.time}`);
        } catch(error){
            dispatch(updateStockFishThinking(false));
            console.error("Failed sending message to StockFish: ",error);
            // Dispatch action to make loader false.
        }

    }, [game,thinking,elo,loadStockFish])


    // Auto trigger StockFish move. After Each move.
    useEffect(()=>{
        if(
            isSinglePlayer &&
            ready &&
            !gameState.isGameOver &&
            !thinking &&
            gameState.turn !== player
        ){
            // Small delay to ensure UI updates before engine starts thinking
            const timer = setTimeout(()=>{
                requestSFMove()
            },stockFishDelay);
            return () => clearTimeout(timer);
        }

    },[ gameState.turn, gameState.isGameOver, isSinglePlayer, player, ready, thinking ])


    // Clean Up
    useEffect(()=>{
        return ()=>{
            if(workerRef.current){
                workerRef.current.terminate();
            }
            isInitializedRef.current = false;
            loadedRef.current = false;
        }
    },[])

    return {
        isLoaded: loadedRef.current,
        isReady: ready,
        isThinking: thinking,
        requestMove: requestSFMove
    }
    // Add request SF move for current player so user can skips some moves.
}
