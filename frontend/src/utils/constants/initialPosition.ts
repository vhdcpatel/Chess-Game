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


export const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
