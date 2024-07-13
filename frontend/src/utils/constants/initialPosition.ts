import { Color, PieceSymbol, Square } from "chess.js";
import { PieceColor, PieceType } from "./srcMap";

export interface PieceModel {
  type: PieceType;
  color: PieceColor;
  position: string;
}

export interface PieceInfoModel {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export interface GameStatus {
  turn: Color;
  gameState: 'OnGoing' | 'Check' | 'CheckMate' | 'StaleMate' | 'Draw';
}

export const initialStatus:GameStatus = {
  turn: 'w',
  gameState: 'OnGoing'
}


export const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
