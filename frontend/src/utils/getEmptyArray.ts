import { PieceInfoModel } from "../features/chessGame/chessModel";

export const generateEmptyBoard = (): (PieceInfoModel | null)[][] =>
    Array(8).fill(null).map(() => Array(8).fill(null));