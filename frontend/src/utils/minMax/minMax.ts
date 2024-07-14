import { Chess, Move } from 'chess.js';;

// Giving the weights to each pieces for the evaluation of the position.
const pieceValues: Record<string, number> = {
  'p': 10, 'r': 50, 'n': 30, 'b': 30, 'q': 90, 'k': 900,
  'P': -10, 'R': -50, 'N': -30, 'B': -30, 'Q': -90, 'K': -900
};

const evaluateBoard = (game: Chess): number => {
  let score = 0;
  const board = game.board();
  for (const row of board) {
    for (const piece of row) {
      if (piece) score += pieceValues[piece.type] * (piece.color === 'w' ? 1 : -1);
    }
  }
  return score;
};

const minimax = (game: Chess, depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number): number => {
  if (depth === 0) {
    return evaluateBoard(game);
  }

  const moves = game.moves({verbose: true}) as Move[];
  if (moves.length === 0) {
    return evaluateBoard(game);
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, false, alpha, beta);
      // back tracking.
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      // alpha beta pruning to save extra unwanted calculation.
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, true, alpha, beta);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
};

export const getBestMove = (game: Chess, depth: number): (Move | null) => {
  let bestMove: Move | null = null;
  let bestValue = -Infinity;
  const moves = game.moves({verbose: true}) as Move[];

  for (const move of moves) {
    game.move(move);
    const boardValue = minimax(game, depth - 1, false, -Infinity, Infinity);
    game.undo();
    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }
  return bestMove;
};
