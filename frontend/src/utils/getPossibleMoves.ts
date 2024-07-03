import { PieceColor, PieceType } from "./constants/srcMap";

interface Piece {
  type: PieceType;
  color: PieceColor;
  position: string;
}

// Utility function to get possible moves for a piece
export const getPossibleMoves = (piece: Piece, piecesPositions: Piece[]): string[] => {
  const { type, color, position } = piece;
  const possibleMoves: string[] = [];
  const [file, rank] = position.split('');
  const fileIndex = file.charCodeAt(0);
  const rankIndex = parseInt(rank, 10);

  const isWithinBounds = (file: number, rank: number) =>
    file >= 97 && file <= 104 && rank >= 1 && rank <= 8;

  const isOpponentPiece = (pos: string) => {
    const pieceAtPosition = piecesPositions.find(p => p.position === pos);
    return pieceAtPosition && pieceAtPosition.color !== color;
  };

  const addMove = (file: number, rank: number) => {
    const move = `${String.fromCharCode(file)}${rank}`;
    if (isWithinBounds(file, rank)) {
      if (!piecesPositions.some(p => p.position === move) || isOpponentPiece(move)) {
        possibleMoves.push(move);
      }
    }
  };

  switch (type) {
    case 'pawn':
      if (color === 'white') {
        addMove(fileIndex, rankIndex + 1);
        if (rankIndex === 2) addMove(fileIndex, rankIndex + 2);
      } else {
        addMove(fileIndex, rankIndex - 1);
        if (rankIndex === 7) addMove(fileIndex, rankIndex - 2);
      }
      break;
    case 'rook':
      for (let i = 1; i <= 8; i++) {
        if (i !== rankIndex) addMove(fileIndex, i);
        if (i !== fileIndex - 96) addMove(96 + i, rankIndex);
      }
      break;
    case 'knight':
      [
        [1, 2], [2, 1], [2, -1], [1, -2],
        [-1, -2], [-2, -1], [-2, 1], [-1, 2]
      ].forEach(([df, dr]) => addMove(fileIndex + df, rankIndex + dr));
      break;
    case 'bishop':
      for (let i = 1; i <= 8; i++) {
        addMove(fileIndex + i, rankIndex + i);
        addMove(fileIndex + i, rankIndex - i);
        addMove(fileIndex - i, rankIndex + i);
        addMove(fileIndex - i, rankIndex - i);
      }
      break;
    case 'queen':
      for (let i = 1; i <= 8; i++) {
        if (i !== rankIndex) addMove(fileIndex, i);
        if (i !== fileIndex - 96) addMove(96 + i, rankIndex);
        addMove(fileIndex + i, rankIndex + i);
        addMove(fileIndex + i, rankIndex - i);
        addMove(fileIndex - i, rankIndex + i);
        addMove(fileIndex - i, rankIndex - i);
      }
      break;
    case 'king':
      [
        [1, 0], [1, 1], [0, 1], [-1, 1],
        [-1, 0], [-1, -1], [0, -1], [1, -1]
      ].forEach(([df, dr]) => addMove(fileIndex + df, rankIndex + dr));
      break;
    default:
      break;
  }

  return possibleMoves;
};
