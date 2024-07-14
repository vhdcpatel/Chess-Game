import { Chess, Color } from "chess.js";
import { GameStatus } from "./constants/initialPosition";

const getGameStatus = (game: Chess): GameStatus => {
    if (game.isCheckmate()) {
        return {turn: game.turn() as Color, gameState: 'CheckMate'};
    }
    if (game.isDraw()) {
        return {turn: game.turn() as Color, gameState: 'Draw'};
    }
    if (game.isStalemate()) {
        return {turn: game.turn() as Color, gameState: 'StaleMate'};
    }
    if (game.isCheck()) {
        return {turn: game.turn() as Color, gameState: 'Check'};
    }
    // Future implementation
    // isInsufficientMaterial(): boolean;
    // isThreefoldRepetition(): boolean;
    // isDraw(): boolean;
    // isGameOver(): boolean;

    return {turn: game.turn() as Color, gameState: 'OnGoing'};
}

export default getGameStatus;