import { PieceSymbol, Square } from "chess.js";

export const getPromotionPieceHandler = (sourceSquare: Square, targetSquare: Square, piece: PieceSymbol) =>{
  let promotion: PieceSymbol | null = null; // default promotion to queen.
  // reverse move is not possible for the pawn so not adding color check.
  if (sourceSquare[1] === '7' && targetSquare[1] === '8' && piece === 'p') {
    promotion = (prompt('Choose promotion piece (q, r, b, n):', 'q') || 'q') as PieceSymbol;
  } else if (sourceSquare[1] === '2' && targetSquare[1] === '1' && piece === 'p') {
    promotion = (prompt('Choose promotion piece (q, r, b, n):', 'q') || 'q') as PieceSymbol;
  }
  return promotion;
}