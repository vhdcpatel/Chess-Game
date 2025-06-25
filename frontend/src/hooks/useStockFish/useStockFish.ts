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

const limitStrength = true;
const stockFishDelay = 1000;

export const useStockFish = ()=>{

    const dispatch = useAppDispatch();

    const workerRef = useRef<Worker | null>(null);
    const isInitializedRef = useRef(false);
    const loadedRef = useRef(false);
    const currentEloRef = useRef<number>(1400);


    const game = useAppSelector((state)=> state.chess.game);
    const gameState = useAppSelector((state)=> state.chess.gameState);
    const isSinglePlayer = useAppSelector((state)=> state.chess.isSinglePlayer);
    const player = useAppSelector((state)=> state.chess.player);
    const stockFishState = useAppSelector((state)=> state.chess.stockFishState);


    // const isEnabled = !!stockFishState;
    
    // Derived state from redux.
    const elo = stockFishState?.elo ?? 1400;
    const ready = stockFishState?.flagReady ?? false;
    const thinking = stockFishState?.flagThinking ?? false;

    const handleStockFishMessage = useCallback((message: string)=>{

        const [type, ...rest] = message.split(" ");

        switch (type){
            case "uciok":
                if(workerRef.current){
                    workerRef.current.postMessage('isready');
                }
                break;

            case 'readyok':
                if(workerRef.current && !isInitializedRef.current){
                   
                    const settings = getEloSettings(currentEloRef.current);
                    
                    workerRef.current.postMessage(`setoption name Skill Level value ${settings.depth}`);

                    // Optionally set other UCI options
                    if(limitStrength){
                        workerRef.current.postMessage(`setoption name UCI_LimitStrength value true`);
                        const stockFish = elo < 1350 ? elo : elo > 2850 ? 2850 : elo;
                        workerRef.current.postMessage(`setoption name UCI_Elo value ${stockFish}`);
                    }

                    // Set threads to 1 for web worker implementation(WASM) as I don't add extra load on web.
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

    },[elo, game, dispatch]);

    // Lazy load StockFish
    const loadStockFish = useCallback(async () => {
        if(loadedRef.current || isInitializedRef.current) return;

        loadedRef.current = true; // flag before load.
        currentEloRef.current = elo; // Move into flag from redux.
        // Read Stale Closure for more info.

        try {
            // workerRef.current = new Worker(
            //     new URL('/stockfish/stockfish-17-lite-single.js', import.meta.url),
            //     { type: 'module' }
            // );
            // Above code cause problem in production environment but working fine in local env.
            // Some issue with path resolve. 

            // Direct access from Public file as code is already compiled.
            workerRef.current = new Worker('/stockfish/stockfish-17-lite-single.js', { type: 'module' });

            // Set up message event handler
            workerRef.current.onmessage = (e)=>{
                handleStockFishMessage(e.data);
            };

            // Handle worker thread errors
            workerRef.current.onerror = (error) => {
                console.error("Stockfish worker error:", error);
                // Reset states.
                loadedRef.current = false;
                isInitializedRef.current = false;
                dispatch(updateStockFishReadystate(false));
            };

            // Initialize UCI protocol; (UCI handshake)
            workerRef.current.postMessage('uci');
        } catch(error){
            console.error("Failed to load StockFish: ", error);
            loadedRef.current = false;
            dispatch(updateStockFishReadystate(false));
        }
    },[elo, dispatch, handleStockFishMessage]);

    // Autoload when single player mode is enabled.
    // Load On Single Player Mode only to save network Bandwidth
    useEffect(()=>{
        if(isSinglePlayer && !loadedRef.current){
            loadStockFish().then(()=>{
                // console.log("Stock Fish is initialized");
            });
        }
    },[isSinglePlayer, loadStockFish]);


    const requestSFMove = useCallback(async ()=>{
        // Added safety for more security
        if(!workerRef.current || !ready || thinking || !game){
            console.error("StockFish is not ready but got request for move.")
            return;
        }
        
        // Can Implement retry mechanism.
        // if(!workerRef.current){
        //     // Try to reload/
        //     await loadStockFish();
        //     if(!workerRef.current) return
        // }


        dispatch(updateStockFishThinking(true));

        const currentFen = game.fen();
        const settings = getEloSettings(elo);

        try{
            // Prepare for new game analysis
            workerRef.current.postMessage('ucinewgame');

            // Set position
            workerRef.current.postMessage(`position fen ${currentFen}`);

            // Start search with appropriate time/depth limits
            const searchCommand = !settings.time ?
                `go movetime ${settings.time}` :
                `go depth ${settings.depth}`
            
            debugger;

            workerRef.current.postMessage(searchCommand);
            // Targeting both depth and time will make game too much hard. (Check which one is working)
            // workerRef.current.postMessage(`go depth ${settings.depth} time ${settings.time}`);
            // workerRef.current.postMessage(`go depth ${settings.depth} movetime ${settings.time}`);
        } catch(error){
            dispatch(updateStockFishThinking(false));
            console.error("Failed sending message to StockFish: ",error);
            // Dispatch action to make loader false.
        }

    }, [game,thinking,elo,ready,dispatch])


    // Auto trigger StockFish move. After Each move.
    useEffect(()=>{
        debugger;
        if(
            isSinglePlayer &&
            ready &&
            !gameState.isGameOver &&
            !thinking &&
            gameState.turn !== player && 
            game
        ){
            // Small delay to ensure UI updates before engine starts thinking
            const timer = setTimeout(()=>{
                requestSFMove()
            },stockFishDelay);

            return () => clearTimeout(timer);
        }

    },[ 
        isSinglePlayer,
        ready, 
        gameState.isGameOver, 
        thinking, 
        gameState.turn, 
        player, 
        game,
        requestSFMove
    ])

    // Update the ELO for already initialized engine (in game change)
    useEffect(() => {
        if (ready && isInitializedRef.current && workerRef.current && elo !== currentEloRef.current) {
            currentEloRef.current = elo;
            const settings = getEloSettings(elo);
            
            workerRef.current.postMessage(`setoption name Skill Level value ${settings.depth}`);
            
            if (limitStrength) {
                const clampedElo = Math.min(Math.max(elo, 1350), 2850);
                workerRef.current.postMessage(`setoption name UCI_Elo value ${clampedElo}`);
            }
        }
    }, [elo, ready]);


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
