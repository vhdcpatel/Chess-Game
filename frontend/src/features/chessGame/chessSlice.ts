import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chess, Move, Square as SquareName, PieceSymbol } from 'chess.js';
import { GameStatus, initialStatus, PieceInfoModel } from '../../utils/constants/initialPosition';
import {ChessState} from './chessModel';
import getGameStatus from '../../utils/getGameStatus';
import { clearActivePieceState } from "./customUtils";

const defaultStartFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const initialState: ChessState = {
    game: new Chess(defaultStartFEN),
    gameState: initialStatus,
    history: [],
    activePiece: null,
    possibleMoves: [],
};

type  makeMovePayload = {
    from: SquareName;
    to: SquareName;
    promotion?: PieceSymbol;
}



const chessSlice = createSlice({
    name: 'chess',
    initialState,
    reducers: {

        initGame(state, action: PayloadAction<string | undefined>) {
            const fen = action.payload || defaultStartFEN;
            state.game = new Chess(fen);
            state.gameState = getGameStatus(state.game);
            state.history = [];
            state.activePiece = null;
            state.possibleMoves = [];
        },

        makeMove(state, action: PayloadAction<makeMovePayload>){

            const {
                from,
                to,
                promotion
            } = action.payload;


            try{
                const moveResult = state.game.move({
                    from,
                    to,
                    promotion
                });

                if(moveResult){
                    // Add to history.
                    state.history.push(moveResult);

                    state.gameState = getGameStatus(state.game)

                    state.activePiece = null;
                    state.possibleMoves = [];
                } else {
                    console.error('Invalid move Attempted', {
                        from,to, promotion
                    });
                }
            }catch(e){
                console.log("Error making move:", e);
            }
        },

        loadGameFromFEN(state, action: PayloadAction<string>){
            try{
                const newGame = new Chess(action.payload)
                state.game = newGame;
                state.gameState = getGameStatus(newGame)

            }catch(e){
                console.log("Error loading game from FEN:", e);
            }
        },

        undoMove (state){
            if(state.history.length > 0){
                state.game.undo();
                state.history.pop();
                state.gameState = getGameStatus(state.game);
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

            // Toggle is the same piece is clicked
            if(state.activePiece?.type == piece.square){
                state.activePiece = null;
                state.possibleMoves = [];
                return;
            }

            if(piece.color === state.gameState.turn){
                state.activePiece = piece;

                const moves = state.game.move({
                    square: piece.square,
                    verbose: true
                });
                state.possibleMoves = moves.map(move => move.to);
            }

        },

        clearActivePiece(state){
            clearActivePieceState(state.game);
        },

        setGame(state, action: PayloadAction<Chess>) {
            state.game = action.payload;
        },
        setGameState(state, action: PayloadAction<GameStatus>) {
            state.gameState = action.payload;
        },
        addMove(state, action: PayloadAction<Move>) {
            state.history.push(action.payload);
        },
        resetHistory(state) {
            state.history = [];
        },

        // setActivePiece(state, action: PayloadAction<PieceInfoModel | null>) {
        //     state.activePiece = action.payload;
        // },
        setPossibleMoves(state, action: PayloadAction<string[]>) {
            state.possibleMoves = action.payload;
        },
    },
});

export const {
    setGame,
    setGameState,
    addMove,
    resetHistory,
    setActivePiece,
    setPossibleMoves,
    initGame,
    makeMove,
} = chessSlice.actions;

export default chessSlice.reducer;
