import { Chess, Move } from "chess.js";
import evaluateBoard from "./evalutions";

/*
 * Function: minimax
 * Performs the minimax algorithm to choose the best move: https://en.wikipedia.org/wiki/Minimax (pseudocode provided)
 * Recursively explores all possible moves up to a given depth, and evaluates the game board at the leaves.
 *
 * Basic idea: maximize the minimum value of the position resulting from the opponent's possible following moves.
 * Optimization: alpha-beta pruning: https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning (pseudocode provided)
 *
 * Inputs:
 *  - game:                 the game object.
 *  - depth:                the depth of the recursive tree of all possible moves (i.e. height limit).
 *  - isMaximizingPlayer:   true if the current layer is maximizing, false otherwise.
 *  - sum:                  the sum (evaluation) so far at the current layer.
 *  - color:                the color of the current player.
 *
 * Output:
 *  the best move at the root of the current subtree.
 * 
 * Modified from the original code of the Zhang Zeyu.
 */

function minimax(game:Chess, depth:number, alpha:number, beta:number, isMaximizingPlayer:boolean, sum:number, color:'w' | 'b'):[Move | null | undefined, Number] {
  let children = game.moves({ verbose: true });

  // Sort moves randomly, so the same move isn't always picked on ties
  children.sort(function (a, b) {
    return 0.5 - Math.random();
  });

  var currMove;
  // Maximum depth exceeded or node is a terminal node (no children)
  if (depth === 0 || children.length === 0) {
    return [null, sum];
  }

  // Find maximum/minimum from list of 'children' (possible moves)
  var maxValue = Number.NEGATIVE_INFINITY;
  var minValue = Number.POSITIVE_INFINITY;
  let bestMove;
  for (var i = 0; i < children.length; i++) {
    currMove = children[i];

    // Note: in our case, the 'children' are simply modified game states
    var currPrettyMove = game.move(currMove);
    var newSum = evaluateBoard(game, currPrettyMove, sum, color);
    var [childBestMove, childValue] = minimax(
      game,
      depth - 1,
      alpha,
      beta,
      !isMaximizingPlayer,
      newSum,
      color
    );

    game.undo();

    if (isMaximizingPlayer && typeof childValue === 'number') {
      if (childValue > maxValue) {
        maxValue = childValue;
        bestMove = currPrettyMove;
      }
      if (childValue > alpha) {
        alpha = childValue;
      }
    } else {
      // For TS.
      if(typeof childValue === 'number'){
        if (childValue < minValue) {
          minValue = childValue;
          bestMove = currPrettyMove;
        }
        if (childValue < beta) {
          beta = childValue;
        }
      }
    }

    // Alpha-beta pruning
    if (alpha >= beta) {
      break;
    }
  }

  if (isMaximizingPlayer) {
    return [bestMove, maxValue];
  } else {
    return [bestMove, minValue];
  }
}

export default minimax;