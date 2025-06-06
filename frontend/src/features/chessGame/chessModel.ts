import { Chess, Move } from "chess.js";
import { GameStatus, PieceInfoModel } from "../../utils/constants/initialPosition";

export interface ChessState {
    game: Chess;
    gameState: GameStatus;
    history: Move[];
    activePiece: PieceInfoModel | null;
    possibleMoves: string[];
}