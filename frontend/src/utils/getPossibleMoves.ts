import { PieceColor, PieceType } from "./constants/srcMap";

interface Piece {
  type: PieceType;
  color: PieceColor;
  position: string;
}

const isWithinBounds = (file: number, rank: number) =>
  file >= 97 && file <= 104 && rank >= 1 && rank <= 8;

const isInCheckAfterMove = (pieces: Piece[], color: PieceColor, move: string) => {
  const updatedPositions = pieces.map(piece =>
    piece.position === move ? { ...piece, position: move } : piece
  ).filter(piece => piece.position !== move);

  const king = updatedPositions.find(p => p.type === 'king' && p.color === color);
  if (!king) return false;

  return updatedPositions
    .filter(p => p.color !== color)
    .some(p => getPossibleMoves(p, updatedPositions, false).includes(king.position));
};

export const getPossibleMoves = (piece: Piece, piecesPositions: Piece[], checkCheck = true): string[] => {
  const { type, color, position } = piece;

  const possibleMoves: string[] = [];

  const [file, rank] = position.split('');

  const fileIndex = file.charCodeAt(0); // a to h.
  const rankIndex = parseInt(rank, 10); // 1 to 8.

  const isOpponentPiece = (pos: string) => {
    const pieceAtPosition = piecesPositions.find(p => p.position === pos);
    return pieceAtPosition && pieceAtPosition.color !== color;
  };

  const isFriendlyPiece = (pos: string) => {
    const pieceAtPosition = piecesPositions.find(p => p.position === pos);
    return pieceAtPosition && pieceAtPosition.color === color;
  };

  const addMove = (file: number, rank: number) => {
    const move = `${String.fromCharCode(file)}${rank}`;
    if (isWithinBounds(file, rank)) {
      if (!piecesPositions.some(p => p.position === move) || isOpponentPiece(move)) {
        possibleMoves.push(move);
      }
    }
  };

  const addDirectionalMoves = (fileIncrement: number, rankIncrement: number) => {
    let currentFile = fileIndex + fileIncrement;
    let currentRank = rankIndex + rankIncrement;

    while (isWithinBounds(currentFile, currentRank)) {
      const move = `${String.fromCharCode(currentFile)}${currentRank}`;
      if (isFriendlyPiece(move)) break;
      possibleMoves.push(move);
      if (isOpponentPiece(move)) break;
      currentFile += fileIncrement;
      currentRank += rankIncrement;
    }
  };

  switch (type) {
    case 'pawn':
      if (color === 'white') {
        const forwardOne = `${String.fromCharCode(fileIndex)}${rankIndex + 1}`;
        if (!piecesPositions.some(p => p.position === forwardOne)) {
          addMove(fileIndex, rankIndex + 1);
          if (rankIndex === 2) {
            const forwardTwo = `${String.fromCharCode(fileIndex)}${rankIndex + 2}`;
            if (!piecesPositions.some(p => p.position === forwardTwo)) {
              addMove(fileIndex, rankIndex + 2);
            }
          }
        }
        [[1, 1], [-1, 1]].forEach(([df, dr]) => {
          const move = `${String.fromCharCode(fileIndex + df)}${rankIndex + dr}`;
          if (isOpponentPiece(move)) {
            possibleMoves.push(move);
          }
        });
      } else {
        const forwardOne = `${String.fromCharCode(fileIndex)}${rankIndex - 1}`;
        if (!piecesPositions.some(p => p.position === forwardOne)) {
          addMove(fileIndex, rankIndex - 1);
          if (rankIndex === 7) {
            const forwardTwo = `${String.fromCharCode(fileIndex)}${rankIndex - 2}`;
            if (!piecesPositions.some(p => p.position === forwardTwo)) {
              addMove(fileIndex, rankIndex - 2);
            }
          }
        }
        [[1, -1], [-1, -1]].forEach(([df, dr]) => {
          const move = `${String.fromCharCode(fileIndex + df)}${rankIndex + dr}`;
          if (isOpponentPiece(move)) {
            possibleMoves.push(move);
          }
        });
      }
      break;

    case 'rook':
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([df, dr]) => addDirectionalMoves(df, dr));
      break;

    case 'knight':
      [
        [1, 2], [2, 1], [2, -1], [1, -2],
        [-1, -2], [-2, -1], [-2, 1], [-1, 2]
      ].forEach(([df, dr]) => addMove(fileIndex + df, rankIndex + dr));
      break;

    case 'bishop':
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([df, dr]) => addDirectionalMoves(df, dr));
      break;

    case 'queen':
      [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([df, dr]) => addDirectionalMoves(df, dr));
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

  // If checking for check, filter out moves that leave the king in check
  if (checkCheck) {
    return possibleMoves.filter(move => !isInCheckAfterMove(piecesPositions, color, move));
  }

  return possibleMoves;
};
