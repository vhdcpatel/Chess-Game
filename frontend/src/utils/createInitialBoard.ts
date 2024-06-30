import { INITIALPOSITIONS, Piece } from "./constants/initialPosition";

const pieceToSymbol = (type: string, color: string): string => {
  const symbols: { [key: string]: string } = {
    rook: 'r',
    knight: 'n',
    bishop: 'b',
    queen: 'q',
    king: 'k',
    pawn: 'p',
  };
  let symbol = symbols[type];
  if (color === 'white') {
    symbol = symbol.toUpperCase();
  }
  return symbol;
};

const positionToIndices = (position: string): [number, number] => {
  const file = position.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(position[1], 10);
  return [rank, file];
};

const createInitialBoard = (pieces: Piece[]): (string | null)[][] => {
  const board: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  pieces.forEach(piece => {
    const [rank, file] = positionToIndices(piece.position);
    board[rank][file] = pieceToSymbol(piece.type, piece.color);
  });
  return board;
};

const initialBoard = createInitialBoard(INITIALPOSITIONS);
console.log(initialBoard);
