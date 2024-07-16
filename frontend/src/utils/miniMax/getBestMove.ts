import { Chess, Move } from "chess.js";
import minimax from "./miniMax";
import evaluateBoard from "./evalutions";

export const getBestMoveNew = (game:Chess, color:'w' | 'b', depth = 3, score:number):[Move | null | undefined, number,number] => {


  let [bestMove, bestMoveValue] = minimax(
    game,
    depth,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    true,
    score,
    color
  );
  let currScore = evaluateBoard(game, bestMove as Move, score, color);

  return [bestMove, bestMoveValue,currScore];
}