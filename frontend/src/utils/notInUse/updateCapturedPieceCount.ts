
import { Color } from "chess.js";
import { CapturedPieceSymbols, TCapturePiecesRecords } from "../../features/chessGame/chessModel";

export function updateCapturedPieceCount(
  capturedPieces: TCapturePiecesRecords,
  capturedBy: Color,
  capturedType: CapturedPieceSymbols,
  increment: boolean
) {
  const opponent = capturedBy === 'w' ? 'b' : 'w';
  const current = capturedPieces[opponent][capturedType] ?? 0;

  if (increment) {
    capturedPieces[opponent][capturedType] = current + 1;
  } else {
    if (current <= 1) {
      delete capturedPieces[opponent][capturedType];
    } else {
      capturedPieces[opponent][capturedType] = current - 1;
    }
  }
}
