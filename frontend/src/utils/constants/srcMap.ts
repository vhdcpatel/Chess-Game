// White Pieces
import whiteRook from '../../assets/chessPieces/rookWhite.png' 
import whiteKnight from '../../assets/chessPieces/kingWhite.png' 
import whiteBishop from '../../assets/chessPieces/bishopWhite.png' 
import whiteQueen from '../../assets/chessPieces/queenWhite.png' 
import whiteKing from '../../assets/chessPieces/kingWhite.png' 
import whitePawn from '../../assets/chessPieces/pawnWhite.png' 
// Black Pieces
import blackRook from '../../assets/chessPieces/rookBlack.png'
import blackKnight from '../../assets/chessPieces/knightBlack.png'
import blackBishop from '../../assets/chessPieces/bishopBlack.png'
import blackQueen from '../../assets/chessPieces/queenBlack.png'
import blackKing from '../../assets/chessPieces/kingBlack.png'
import blackPawn from '../../assets/chessPieces/pawnBlack.png'

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