import { useAppDispatch } from "../useAppDispatch";
import { useAppSelector } from "../useAppSelector";
import { useCallback, useEffect, useRef } from "react";
import { getEloSettings } from "../../utils/getEloSettings";

// interface StockFishWorker {
//     postMessage: (message: string)=> void;
//     onMessage: ((event: MessageEvent)=> void) | null;
//     terminate: () => void;
// }

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

    const isEnabled = !!stockFishState; // Do Any Action if isEnabled.
    const elo = stockFishState?.elo ?? 1400;
    const ready = stockFishState?.flagReady ?? false;
    const thinking = stockFishState?.flagThinking ?? false;

    // Lazy load Stockfish
    const loadStockFish = useCallback(async () => {
        if(loadedRef.current || isInitializedRef.current) return;

        loadedRef.current = true;

        try {
            workerRef.current =  new Worker(
                new URL('../workers/stockfishWorker.ts', import.meta.url),
                { type: 'classic' }
            );

            // Set up message event handler.
            workerRef.current.onmessage = (e)=>{
                handleStockfishMessage(e.data);
            };

            // Initialize UCI commands;
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

        if(message  === "readyok"){
            // Update the state on toolkit.
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

        // Dispatch Action for thinking. to show loader.
        const currentFen = game.fen();
        const settings = getEloSettings(elo);

        try{
            workerRef.current.postMessage('ucinewgame');
            workerRef.current.postMessage(`position fen ${currentFen}`);
            workerRef.current.postMessage(`go depth ${settings.depth} movetime ${settings.time}`);
        } catch(error){
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
            // Made SF move;
            requestSFMove()
        }

    },[ gameState.turn, gameState.isGameOver, isSinglePlayer, player, ready, thinking ])


    // Clean Up
    useEffect(()=>{
        return ()=>{
            if(workerRef.current){
                workerRef.current.terminate();
            }
        }
    },[])

    return {
        isLoaded: loadedRef.current,
    }
    // Add request SF move for current player so user can skips some moves.
}
