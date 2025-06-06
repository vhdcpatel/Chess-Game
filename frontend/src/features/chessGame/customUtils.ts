import { ChessState } from './chessModel';

export function clearActivePieceState(state: ChessState) {
    state.activePiece = null;
    state.possibleMoves = [];
}