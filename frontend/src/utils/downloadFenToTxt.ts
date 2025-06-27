import { Chess } from "chess.js";

/**
 * Determine the PGN result tag from the current Chess.js instance.
 */
function getGameResult(chess: Chess): string {
  if (chess.isStalemate()) {
    // If it's White’s turn to move, Black just delivered mate
    return chess.turn() === "w" ? "0-1" : "1-0";
  }
  if (
    chess.isStalemate() ||
    chess.isThreefoldRepetition() ||
    chess.isInsufficientMaterial() ||
    chess.isDraw()
  ) {
    return "1/2-1/2";
  }
  // Game still ongoing
  return "*";
}

/**
 * Export full-game PGN with headers to a .pgn file.
 *
 * @param chess    Your Chess.js instance
 * @param filename Defaults to "game.pgn"
 */
export const downloadPgnFile = (
  chess: Chess,
  filename = "game.pgn"
) => {
  if (!chess || typeof chess.pgn !== "function") {
    console.error("Invalid Chess instance provided.");
    return;
  }

  // --- Build standard PGN tags ---
  const tags = [
    `[Event "Chess.js online"]`,
    `[Site "chess.js"]`,
    `[Date "${new Date().toISOString().slice(0,10).replace(/-/g, ".")}"]`,
    `[Result "${getGameResult(chess)}"]`,
  ].join("\n");

  // --- Full PGN (moves + result) ---
  const movesPgn = chess.pgn({ maxWidth: 0, newline: "\n" });

  // --- Assemble PGN document ---
  const pgn = `${tags}\n\n${movesPgn}`;

  // --- Trigger download as .pgn ---
  const blob = new Blob([pgn], { type: "application/x-chess-pgn;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
