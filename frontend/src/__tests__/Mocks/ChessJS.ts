import { vi } from "vitest";
import { defaultStartFEN } from "../../features/chessGame/ChessConstant";
import { Chess } from "chess.js";

const baseMockChessGame = () => ({
    board: vi.fn().mockReturnValue([]),
    move: vi.fn(),
    moves: vi.fn().mockReturnValue([]),
    get: vi.fn(),
    undo: vi.fn(),
    history: vi.fn().mockReturnValue([]),
    isInsufficientMaterial: vi.fn().mockReturnValue(false),
    isThreefoldRepetition: vi.fn().mockReturnValue(false),
    fen: vi.fn().mockReturnValue(defaultStartFEN),
    turn: vi.fn().mockReturnValue('w'),
    isCheck: vi.fn().mockReturnValue(false),
    isCheckmate: vi.fn().mockReturnValue(false),
    isStalemate: vi.fn().mockReturnValue(false),
    isDraw: vi.fn().mockRetursnValue(false),
    isGameOver: vi.fn().mockReturnValue(false),
}) as unknown as Chess;

export default baseMockChessGame;