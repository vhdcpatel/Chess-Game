import { Chess } from "chess.js";
import { GameStatus } from "../features/chessGame/chessModel";

const getGameStatus = (game: Chess): GameStatus  => {
    const isCheck = game.isCheck();
    const isCheckmate = game.isCheckmate();
    const isStalemate = game.isStalemate();
    const isDraw = game.isDraw();
    const isGameOver = game.isGameOver();

    let gameState: 'OnGoing' | 'Check' | 'CheckMate' | 'StaleMate' | 'Draw';

    if (isCheckmate) {
        gameState = 'CheckMate';
    } else if (isStalemate) {
        gameState = 'StaleMate';
    } else if (isDraw) {
        gameState = 'Draw';
    } else if (isCheck) {
        gameState = 'Check';
    } else {
        gameState = 'OnGoing';
    }

    return {
        turn: game.turn(),
        gameState,
        isGameOver,
        // Additional useful information
        // moveCount: game.moveNumber(),
        // halfMoveClock: game.getComment() || '', // For 50-move rule tracking
        // canUndo: game.history().length > 0,
        // inCheck: isCheck,
        // legalMoves: game.moves().length,
        // fen: game.fen(),
        // pgn: game.pgn()
    };
};

export default getGameStatus;
