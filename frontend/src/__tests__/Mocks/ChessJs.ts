import { vi } from "vitest";
import type { Color, Piece, PieceSymbol, Square } from "chess.js";

export class ChessMock {
    // Internal/private properties (these typically don't need mocking unless directly accessed publicly)
    constructor(fen?: string, options?: { skipValidation?: boolean }) {}

    // Public methods (mocked with default return values)
    clear = vi.fn(({ preserveHeaders }: { preserveHeaders?: boolean } = {}) => {
        return undefined; // Returns nothing
    });
    load = vi.fn((fen: string, { skipValidation, preserveHeaders }: { skipValidation?: boolean; preserveHeaders?: boolean } = {}) => {
        return true; // Indicates successful load
    });
    fen = vi.fn(({ forceEnpassantSquare }: { forceEnpassantSquare?: boolean } = {}) => {
        return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // Default starting FEN
    });
    reset = vi.fn(() => {
        return undefined;
    });
    get = vi.fn((square: Square) => {
        return null; // No piece found on the square by default
    });
    findPiece = vi.fn((piece: Piece) => {
        return []; // No pieces found by default
    });
    put = vi.fn(({ type, color }: { type: PieceSymbol; color: Color }, square: Square) => {
        return true; // Indicates successful put
    });
    remove = vi.fn((square: Square) => {
        return null; // No piece removed by default
    });
    attackers = vi.fn((square: Square, attackedBy?: Color) => {
        return []; // No attackers by default
    });
    hash = vi.fn(() => {
        return "mock-hash"; // A placeholder hash
    });
    isAttacked = vi.fn((square: Square, attackedBy: Color) => {
        return false; // Not attacked by default
    });
    isCheck = vi.fn(() => {
        return false; // Not in check by default
    });
    inCheck = vi.fn(() => {
        return false; // Not in check by default (alias for isCheck)
    });
    isCheckmate = vi.fn(() => {
        return false; // Not checkmate by default
    });
    isStalemate = vi.fn(() => {
        return false; // Not stalemate by default
    });
    isInsufficientMaterial = vi.fn(() => {
        return false; // Not insufficient material by default
    });
    isThreefoldRepetition = vi.fn(() => {
        return false; // Not threefold repetition by default
    });
    isDrawByFiftyMoves = vi.fn(() => {
        return false; // Not draw by fifty moves by default
    });
    isDraw = vi.fn(() => {
        return false; // Not a draw by default
    });
    isGameOver = vi.fn(() => {
        return false; // Game not over by default
    });
    moves = vi.fn(() => {
        return []; // No moves by default
    });
    move = vi.fn((move: string | { from: string; to: string; promotion?: string }, { strict }: { strict?: boolean } = {}) => {
        return null; // No move made by default (or return a mock Move object if needed)
    });
    undo = vi.fn(() => {
        return null; // No move undone by default
    });
    pgn = vi.fn(({ newline, maxWidth }: { newline?: string; maxWidth?: number } = {}) => {
        return ""; // Empty PGN string by default
    });
    header = vi.fn((...args: string[]) => {
        // If called with arguments, it's setting, if no args, it's getting all.
        // We'll mock it to return an object for getting, and undefined for setting.
        if (args.length === 0) {
            return {}; // Empty object for all headers
        }
        return undefined; // For setting a specific header
    });
    setHeader = vi.fn((key: string, value: string) => {
        return undefined;
    });
    removeHeader = vi.fn((key: string) => {
        return undefined;
    });
    getHeaders = vi.fn(() => {
        return {}; // Empty headers object
    });
    loadPgn = vi.fn((pgn: string, { strict, newlineChar }: { strict?: boolean; newlineChar?: string } = {}) => {
        return true; // Indicates successful load
    });
    ascii = vi.fn(() => {
        return "Mock ASCII board"; // Placeholder ASCII
    });
    perft = vi.fn((depth: number) => {
        return 0; // Perft count is 0 by default
    });
    turn = vi.fn(() => {
        return "w" as Color; // White's turn by default
    });
    squareColor = vi.fn((square: Square) => {
        return "light"; // Default square color
    });
    history = vi.fn(() => {
        return []; // Empty history by default
    });
    getComment = vi.fn(() => {
        return undefined; // No comment by default
    });
    setComment = vi.fn((comment: string) => {
        return undefined;
    });
    deleteComment = vi.fn(() => {
        return undefined;
    });
    removeComment = vi.fn(() => {
        return undefined; // Alias for deleteComment
    });
    getComments = vi.fn(() => {
        return []; // No comments by default
    });
    deleteComments = vi.fn(() => {
        return undefined;
    });
    removeComments = vi.fn(() => {
        return undefined; // Alias for deleteComments
    });
    setCastlingRights = vi.fn((color: Color, rights: Partial<Record<"KING" | "QUEEN", boolean>>) => {
        return undefined;
    });
    getCastlingRights = vi.fn((color: Color) => {
        return { KING: true, QUEEN: true }; // Full castling rights by default
    });
    moveNumber = vi.fn(() => {
        return 1; // Move number 1 by default
    });

    board = vi.fn(() => {
        // Return a mock representation of a board, e.g., an empty 2D array or a simple structure
        // This can be overridden in specific tests if a detailed board state is needed.
        return Array(8).fill(null).map(() => Array(8).fill(null));
    });
}

export default ChessMock;