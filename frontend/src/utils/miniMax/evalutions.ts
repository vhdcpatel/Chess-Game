import { Chess, Move, PieceSymbol } from "chess.js";
import { pstOpponent, pstSelf, weights } from "./weights";

function evaluateBoard(game: Chess, move:Move, prevSum:number, color:'w' | 'b'):number {

  if (game.isCheckmate()) {
    // Opponent is in checkmate (good for us)
    if (move.color === color) {
      return 10 ** 10;
    }
    // Our king's in checkmate (bad for us)
    else {
      return -(10 ** 10);
    }
  }

  if (game.isDraw() || game.isThreefoldRepetition() || game.isStalemate())
  {
    return 0;
  }

  if (game.isCheck()) {
    // Opponent is in check (good for us)
    if (move.color === color) {
      prevSum += 50;
    }
    // Our king's in check (bad for us)
    else {
      prevSum -= 50;
    }
  }

  var from = [
    8 - parseInt(move.from[1]),
    move.from.charCodeAt(0) - 'a'.charCodeAt(0),
  ];
  var to = [
    8 - parseInt(move.to[1]),
    move.to.charCodeAt(0) - 'a'.charCodeAt(0),
  ];

  // Change endgame behavior for kings
  if (prevSum < -1500) {
    if (move.piece === 'k') {
      // Check I don't know ?
      move.piece = 'k_e';
    }
    // Kings can never be captured
    // else if (move.captured === 'k') {
    //   move.captured = 'k_e';
    // }
  }

  if ('captured' in move && move.captured !== undefined) {
    // Opponent piece was captured (good for us)
    if (move.color === color) {
      prevSum +=
        weights[move.captured] +
        pstOpponent[move.color][move.captured][to[0]][to[1]];
    }
    // Our piece was captured (bad for us)
    else {
      prevSum -=
        weights[move.captured] +
        pstSelf[move.color][move.captured][to[0]][to[1]];
    }
  }

  if (move.flags.includes('p')) {
    // NOTE: promote to queen for simplicity
    move.promotion = 'q';

    // Our piece was promoted (good for us)
    if (move.color === color) {
      prevSum -=
        weights[move.piece] + pstSelf[move.color][move.piece][from[0]][from[1]];
      prevSum +=
        weights[move.promotion] +
        pstSelf[move.color][move.promotion][to[0]][to[1]];
    }
    // Opponent piece was promoted (bad for us)
    else {
      prevSum +=
        weights[move.piece] + pstSelf[move.color][move.piece][from[0]][from[1]];
      prevSum -=
        weights[move.promotion] +
        pstSelf[move.color][move.promotion][to[0]][to[1]];
    }
  } else {
    // The moved piece still exists on the updated board, so we only need to update the position value
    if (move.color !== color) {
      prevSum += pstSelf[move.color][move.piece][from[0]][from[1]];
      prevSum -= pstSelf[move.color][move.piece][to[0]][to[1]];
    } else {
      prevSum -= pstSelf[move.color][move.piece][from[0]][from[1]];
      prevSum += pstSelf[move.color][move.piece][to[0]][to[1]];
    }
  }

  return prevSum;
}

export default evaluateBoard;