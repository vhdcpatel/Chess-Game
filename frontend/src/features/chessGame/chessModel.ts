import { Chess, Color, Move, PieceSymbol, Square, Square as SquareName } from "chess.js";

export type playerColor = 'w' | 'b';

export type pieceTypeForPromotion = 'q' | 'r' | 'b' | 'n';

export interface GameStatus {
    turn: Color;
    gameState: 'OnGoing' | 'Check' | 'CheckMate' | 'StaleMate' | 'Draw';
    isGameOver: boolean;
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

export interface StockFishStateModel {
    flagReady: boolean;
    flagThinking: boolean;
    elo: number;
    error: string | null;
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
    gameEndReason: null | string;
    stockFishState: StockFishStateModel | null;
}

export interface makeMovePayload {
    from: SquareName;
    to: SquareName;
    promotion?: PieceSymbol;
}

export interface StartGamePayload {
    player: playerColor;
    isSinglePlayer: boolean;
    elo?: number;
}