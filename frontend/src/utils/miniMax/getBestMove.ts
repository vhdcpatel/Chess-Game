import { Chess } from "chess.js";
import minimax from "./miniMax";

export const getBestMoveNew = (game:Chess, color:'w' | 'b', depth = 3, score:number) => {


  var [bestMove, bestMoveValue] = minimax(
    game,
    depth,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    true,
    score,
    color
  );

  return [bestMove, bestMoveValue];
}