import { GameStatus } from "./chessModel";

export const defaultStartFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const InitialGameState: GameStatus = {
    turn: 'w',
    gameState: 'OnGoing',
    globalSum: 0
}