import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { Chess, PieceSymbol, } from 'chess.js';
import { PieceInfoModel } from '../../utils/constants/initialPosition';
import { makeMovePayload } from './chessModel';
import getGameStatus from '../../utils/getGameStatus';
import { defaultStartFEN, initialState } from "./ChessConstant";

const chessSlice = createSlice({
    name: 'chess',
    initialState,
    reducers: {
        initGame(state, action: PayloadAction<string | undefined>) {
            const fen = action.payload || defaultStartFEN;
            const gameState = new Chess(fen);

            state.game = gameState;
            state.gameState = getGameStatus(gameState);
            state.history = [];
            state.activePiece = null;
            state.possibleMoves = [];
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

            }else{
                // Try to localize use of try catch at the place where you think changes of error are maximum.
                try{
                    // Regular move:
                    const moveResults = state.game.move({from, to});
                    if(moveResults){
                        state.history.push(moveResults); // Might not need in future will drop in the future.
                        // Update the game state (Safe as you are not updating game inside getGameStatus.)
                        state.gameState = getGameStatus(state.game as Chess);
                        state.activePiece = null;
                        state.possibleMoves = [];
                    }
                }catch (e) {
                    console.error("Error attempting move: ",e);
                }
            }

        },

        executePromotion(state, action: PayloadAction<PieceSymbol>){
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
                    state.gameState = getGameStatus(state.game as Chess);
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
                    state.gameState = getGameStatus(state.game as Chess);
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
                state.gameState = getGameStatus(state.game as Chess)

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
                state.gameState = getGameStatus(state.game as Chess);
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

            if(!state.activePiece || !state.activePiece.type) return;

            // Toggle active piece.
            if(state.activePiece.square == piece.square){
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
            return;
        },

        resetFullGame(){
          return initialState;
        },

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
    resetFullGame
} = chessSlice.actions;

export default chessSlice.reducer;
