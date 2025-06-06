import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chess, Move } from 'chess.js';
import { GameStatus, initialStatus, PieceInfoModel } from '../../utils/constants/initialPosition';
import {ChessState} from './chessModel';

const defaultStartFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const initialState: ChessState = {
    game: new Chess(defaultStartFEN),
    gameState: initialStatus,
    history: [],
    activePiece: null,
    possibleMoves: [],
};

const chessSlice = createSlice({
    name: 'chess',
    initialState,
    reducers: {
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
        setActivePiece(state, action: PayloadAction<PieceInfoModel | null>) {
            state.activePiece = action.payload;
        },
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
} = chessSlice.actions;

export default chessSlice.reducer;
