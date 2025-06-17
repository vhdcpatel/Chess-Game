import { useAppDispatch } from "../useAppDispatch";
import { useAppSelector } from "../useAppSelector";
import { useCallback, useEffect, useRef } from "react";
import { getEloSettings } from "../../utils/getEloSettings";
import {
    makeMove,
    updateStockFishReadystate,
    updateStockFishThinking
} from "../../features/chessGame/chessSlice";
import { PieceSymbol, Square } from "chess.js";

// interface StockFishWorker {
//     postMessage: (message: string)=> void;
//     onMessage: ((event: MessageEvent)=> void) | null;
//     terminate: () => void;
// }

const limitStrength = true;

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
            const workerUrl = new URL('../../workers/stockfishWorker.js', import.meta.url);
            console.log('Worker URL:', workerUrl.href);

            workerRef.current = new Worker(workerUrl, {
                type: 'classic',
                name: 'stockfish-worker'
            });

            // Set up message event handler.
            workerRef.current.onmessage = (e)=>{
                handleStockfishMessage(e.data);
            };

            // Handle worker errors
            workerRef.current.onerror = (error) => {
                console.error("Stockfish worker error:", error);
                loadedRef.current = false;
            };

            // Initialize UCI protocol;
            workerRef.current.postMessage('uci');

            // Simulate ELO by mapping ELO to skill level;
            // workerRef.current.postMessage('set-option name skill level value'+ )
        } catch(error){
            console.error("Failed to load Stockfish: ",error);
            // Update it in slice with
            loadedRef.current = false;
        }
    },[]);

    const handleStockfishMessage = useCallback((message: string)=>{
        console.log("Stock Fish message", message);
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
                        workerRef.current.postMessage(`setoption name UCI_Elo value ${elo}`);
                    }

                    // Set threads to 1 for web worker implementation.(WASM);
                    workerRef.current.postMessage("setoption name Threads value 1");

                    isInitializedRef.current = true;
                    dispatch(updateStockFishReadystate(true));

                }
                break;

            case "bestmove":
                { const bestMove = rest[0];
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
    useEffect(()=>{
        if(isSinglePlayer && !loadedRef.current){
            loadStockFish().then(()=>{

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
                `go depth ${settings.time}`

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


    // Auto trigger StockFish move.
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
            },100);
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
