import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chess, Move } from 'chess.js';
import { PieceInfoModel } from '../../utils/constants/initialPosition';
import { ChessState, makeMovePayload, pieceTypeForPromotion, StartGamePayload } from './chessModel';
import getGameStatus from '../../utils/getFullGameStatus';
import { defaultStartFEN, initialState } from "./ChessConstant";
import { WritableDraft } from 'immer';

const updateGameStateAfterMove = (state: WritableDraft<ChessState>, lastMove?: Move) => {
    if(!state.game) return;

    const newGameState = getGameStatus(state.game as Chess);
    state.gameState = newGameState;

    if(lastMove){
        // For Showing why Getting checkMate.
        // state.lastMove = moveResult;
    }

    if(newGameState.isGameOver){
        if (newGameState.gameState === 'CheckMate') {
            const winner = newGameState.turn === 'w' ? 'Black' : 'White';
            state.gameEndReason = `Checkmate! ${winner} wins.`;

        } else if (newGameState.gameState === 'StaleMate') {
            state.gameEndReason = 'Draw by stalemate.';
        } else if (newGameState.gameState === 'Draw') {
            // Check specific draw reasons
            if (state.game.isInsufficientMaterial()) {
                state.gameEndReason = 'Draw by insufficient material.';
            } else if (state.game.isThreefoldRepetition()) {
                state.gameEndReason = 'Draw by threefold repetition.';
            } else {
                state.gameEndReason = 'Draw by 50-move rule.';
            }
        }
    }
}


const chessSlice = createSlice({
    name: 'chess',
    initialState,
    reducers: {
        initGame(state, action: PayloadAction<string | undefined>) {
            const fen = action.payload || defaultStartFEN;
            state.game = new Chess(fen);
            updateGameStateAfterMove(state);
            state.history = [];
            state.activePiece = null;
            state.possibleMoves = [];
        },

        startGame(state, action: PayloadAction<StartGamePayload>) {
            const {  player, isSinglePlayer, elo } = action.payload;
            state.player = player;
            state.isSinglePlayer = isSinglePlayer;
            if(isSinglePlayer && elo){
                state.stockFishState = {
                    elo: elo,
                    flagReady: false,
                    flagThinking: false,
                    error: null
                }
            }else{
                state.stockFishState = null;
            }
        },

        // Handle all moves expect promotion case.
        attemptMove(state,action: PayloadAction<makeMovePayload>){
            const {
                from,
                to
            } = action.payload;

            // Check for not null;
            if(!state.game) return;

            const piece = state.game.get(from);

            if(!piece) return;

            const isPromotion = (piece.type === 'p') &&
                ((piece.color === 'w' && to[1] ==="8") ||
                    (piece.color === 'b' && to[1] ==="1")
                );

            if(isPromotion){
                // Handle the promotion model for new pawn.
                state.promotionInfo = {
                    from: from,
                    to: to,
                    color: piece.color,
                }
            }else{
                // Try to localize use of try catch at the place where you think changes of error are maximum.
                try{
                    // Regular move:
                    const moveResults = state.game.move({from, to});
                    if(moveResults){
                        state.history.push(moveResults); // Might not need in future will drop in the future.
                        // Update the game state (Safe as you are not updating game inside getGameStatus.)
                        // state.gameState = getGameStatus(state.game as Chess);
                        updateGameStateAfterMove(state);
                        state.activePiece = null;
                        state.possibleMoves = [];
                    }
                }catch (e) {
                    console.error("Error attempting move: ",e);
                }
            }

        },

        executePromotion(state, action: PayloadAction<pieceTypeForPromotion>){
            if(!state.promotionInfo || !state.game) return;

            const promotion = action.payload;
            const {
                from,
                to,
            } = state.promotionInfo;

            if(!from || !to) return; // validation for move;

            try{
                // create util in future by passing draft.
                const moveResults = state.game.move({from, to, promotion});
                if(moveResults){
                    state.history.push(moveResults);
                    updateGameStateAfterMove(state);
                    // state.gameState = getGameStatus(state.game as Chess);
                }
            } catch(e){
                console.error("Error attempting move with promotion ",e);
            }

            state.promotionInfo = null;
            state.activePiece = null;
            state.possibleMoves = [];
        },

        cancelPromotion(state){
            state.promotionInfo = null;
        },

        makeMove(state, action: PayloadAction<makeMovePayload>) {
            if(!state.game) return;

            const { from, to, promotion } = action.payload;

            try {
                const moveResult = state.game.move({ from, to, promotion });
                if (moveResult) {
                    state.history.push(moveResult);
                    updateGameStateAfterMove(state);
                    // state.gameState = getGameStatus(state.game as Chess);
                    state.activePiece = null;
                    state.possibleMoves = [];
                }
            } catch (error) {
                console.error('Invalid move:', error);
            }
        },

        loadGameFromFEN(state, action: PayloadAction<string>){
            try{
                state.game = new Chess(action.payload);
                updateGameStateAfterMove(state);
                // state.gameState = getGameStatus(state.game as Chess)

            }catch(e){
                console.log("Error loading game from FEN:", e);
            }
        },

        // Undo last move;
        undoMove (state){
            if(!state.game) return;

            const moveHistory = state.game.history();
            if(moveHistory.length > 0){
                state.game.undo();
                // state.gameState = getGameStatus(state.game as Chess);
                updateGameStateAfterMove(state);
                state.promotionInfo = null;
                state.activePiece = null;
                state.possibleMoves = [];

            }
        },

        setActivePiece(state, action: PayloadAction<PieceInfoModel>){
            const piece = action.payload;
            if(!piece){
                state.activePiece = null;
                state.possibleMoves = [];
                return;
            }

            // Toggle active piece.
            if(state.activePiece && state.activePiece.square === piece.square){
                state.activePiece = null;
                state.possibleMoves = [];
                return;
            }

            if(!state.game) return;

            if(piece.color === state.gameState.turn){
                state.activePiece = piece;

                const moves = state.game.moves({
                    square: piece.square,
                    verbose: true
                });
                // Just use the squares.
                state.possibleMoves = moves.map(move => move.to);
            }
        },

        clearActivePiece(state){
            state.activePiece = null;
            state.possibleMoves = [];
        },

        clearPossibleMoves(state){
            state.possibleMoves = [];
        },

        resetFullGame(){
            // Not needed just clear complete board which is not need.
          return initialState;
        },

        updateStockFishThinking(state, action: PayloadAction<boolean>){
            const thinkingState = action.payload;
            if (!state.stockFishState) {
                console.warn("Stockfish state is null — cannot update thinking flag.");
                return;
            }
            state.stockFishState.flagThinking = thinkingState;
        },

        updateStockFishReadystate(state, action: PayloadAction<boolean>){
            const readyState = action.payload;
            if (!state.stockFishState) {
                console.warn("Stockfish state is null — cannot update thinking flag.");
                return;
            }
            state.stockFishState.flagReady = readyState;
        }

    },
});

export const {
    initGame,
    attemptMove,
    executePromotion,
    cancelPromotion,
    makeMove,
    loadGameFromFEN,
    undoMove,
    setActivePiece,
    clearActivePiece,
    clearPossibleMoves,
    resetFullGame,
    startGame,
    updateStockFishThinking,
    updateStockFishReadystate
} = chessSlice.actions;

export default chessSlice.reducer;
