import { ChessState, GameStatus } from "./chessModel";

export const defaultStartFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const InitialGameState: GameStatus = {
    turn: 'w',
    gameState: 'OnGoing',
    isGameOver: false,
}

export const initialState: ChessState = {
    player: 'w',
    isSinglePlayer: true,
    game: null,
    possibleMoves: [],
    gameState: InitialGameState,
    activePiece: null,
    history: [],
    promotionInfo: null,
    gameEndReason: null,
    stockFishState: null,
};