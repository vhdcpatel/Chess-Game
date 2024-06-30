// White Pieces
import whiteRook from '../../assets/chessPieces/rookWhite.webp' 
import whiteKnight from '../../assets/chessPieces/kingWhite.webp' 
import whiteBishop from '../../assets/chessPieces/bishopWhite.webp' 
import whiteQueen from '../../assets/chessPieces/queenWhite.webp' 
import whiteKing from '../../assets/chessPieces/kingWhite.webp' 
import whitePawn from '../../assets/chessPieces/pawnWhite.webp' 
// Black Pieces
import blackRook from '../../assets/chessPieces/rookBlack.webp'
import blackKnight from '../../assets/chessPieces/knightBlack.webp'
import blackBishop from '../../assets/chessPieces/bishopBlack.webp'
import blackQueen from '../../assets/chessPieces/queenBlack.webp'
import blackKing from '../../assets/chessPieces/kingBlack.webp'
import blackPawn from '../../assets/chessPieces/pawnBlack.webp'

export type PieceColor = 'white' | 'black';
export type PieceType = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn';

export const getSrc: Record<PieceColor, Record<PieceType, string>> = {
  'white': {
    'rook': whiteRook,
    'knight': whiteKnight,
    'bishop': whiteBishop,
    'queen': whiteQueen,
    'king': whiteKing,
    'pawn': whitePawn
  },
  'black': {
    'rook': blackRook,
    'knight': blackKnight,
    'bishop': blackBishop,
    'queen': blackQueen,
    'king': blackKing,
    'pawn': blackPawn
  }
}