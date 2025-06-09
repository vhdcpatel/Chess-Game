import { Chess, Color, Move, PieceSymbol, Square, Square as SquareName } from "chess.js";

export type playerColor = 'w' | 'b';

export interface GameStatus {
    turn: Color;
    gameState: 'OnGoing' | 'Check' | 'CheckMate' | 'StaleMate' | 'Draw';
}

export interface PieceInfoModel {
    square: Square;
    type: PieceSymbol;
    color: Color;
}

export interface PromotionInfoModel {
    from: Square;
    to: Square;
    color: Color;
}

export interface ChessState {
    player: playerColor;
    isSinglePlayer: boolean;
    game: Chess | null;
    gameState: GameStatus;
    history: Move[];
    activePiece: PieceInfoModel | null;
    possibleMoves: string[];
    promotionInfo: PromotionInfoModel | null;
}

export interface makeMovePayload {
    from: SquareName;
    to: SquareName;
    promotion?: PieceSymbol;
}