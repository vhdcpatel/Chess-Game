import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chess, Move } from 'chess.js';
import { GameStatus, PieceInfoModel } from '../../utils/constants/initialPosition';
import { ChessState, makeMovePayload } from './chessModel';
import getGameStatus from '../../utils/getGameStatus';
import { clearActivePieceState } from "./customUtils";
import { defaultStartFEN, InitialGameState } from "./ChessConstant";

const initialState: ChessState = {
    player: 'w',
    isSinglePlayer: true,
    game: null,
    possibleMoves: [],
    gameState: InitialGameState,
    activePiece: null,
    history: [],
};

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
