import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Chess, PieceSymbol } from 'chess.js';
import chessReducer, {
    initGame,
    startGame,
    attemptMove,
    executePromotion,
    cancelPromotion,
    makeMove,
    loadGameFromFEN,
    undoMove,
    setActivePiece,
    clearActivePiece,
    clearPossibleMoves,
    resetFullGame,
} from '../../../features/chessGame/chessSlice';
import { ChessState } from '../../../features/chessGame/chessModel';
import { initialState, defaultStartFEN } from '../../../features/chessGame/ChessConstant';
import getGameStatus from '../../../utils/getFullGameStatus';
import { Color, Square } from "chess.js/src/chess";

// Mock the external dependencies
vi.mock('../../../utils/getFullGameStatus');
vi.mock('chess.js');

const mockGetGameStatus = vi.mocked(getGameStatus);
const MockedChess = vi.mocked(Chess);

describe('Chess Slice', () => {
    // Test data factories for consistent test data
    const createMockGameState = (overrides = {}) => ({
        turn: 'w' as const,
        isGameOver: false,
        gameState: 'OnGoing' as const,
        ...overrides,
    });

    const createMockChessInstance = () => ({
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
        isDraw: vi.fn().mockReturnValue(false),
        isGameOver: vi.fn().mockReturnValue(false),
    });

    const createStateWithGame = (overrides = {}) => ({
        ...initialState,
        game: createMockChessInstance(),
        gameState: createMockGameState(),
        ...overrides,
    });

    const createPiece = (type: PieceSymbol = 'p', color: Color  = 'w', square: Square = 'e2') => ({
        type: type,
        color: color,
        square: square,
    });

    let mockChessInstance: ReturnType<typeof createMockChessInstance>;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Create fresh mock instance
        mockChessInstance = createMockChessInstance();
        mockGetGameStatus.mockReturnValue(createMockGameState());
        MockedChess.mockImplementation(() => mockChessInstance as unknown as Chess);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('initGame', () => {
        it('should initialize game with default FEN when no payload provided', () => {
            const action = initGame(undefined);
            const state = chessReducer(initialState, action);

            expect(MockedChess).toHaveBeenCalledWith(defaultStartFEN);
            expect(state.game).toBeDefined();
            expect(state.history).toEqual([]);
            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
            expect(mockGetGameStatus).toHaveBeenCalledWith(mockChessInstance);
        });

        it('should initialize game with custom FEN when provided', () => {
            const customFEN = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';

            const action = initGame(customFEN);
            const state = chessReducer(initialState, action);

            expect(MockedChess).toHaveBeenCalledWith(customFEN);
            expect(state.game).toBeDefined();
        });

        it('should reset all game state properties to initial values', () => {
            const modifiedState: ChessState = {
                ...initialState,
                history: [{ from: 'e2', to: 'e4', san: 'e4' }],
                activePiece: createPiece(),
                possibleMoves: ['e3', 'e4'],
            };

            const action = initGame(undefined);
            const state = chessReducer(modifiedState, action);

            expect(state.history).toEqual([]);
            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
        });
    });

    describe('startGame', () => {
        it('should configure single player game with specified player color', () => {
            const action = startGame({ player: 'b', isSinglePlayer: true });
            const state = chessReducer(initialState, action);

            expect(state.player).toBe('b');
            expect(state.isSinglePlayer).toBe(true);
        });

        it('should configure multiplayer game setup', () => {
            const action = startGame({ player: 'w', isSinglePlayer: false });
            const state = chessReducer(initialState, action);

            expect(state.player).toBe('w');
            expect(state.isSinglePlayer).toBe(false);
        });
    });

    describe('attemptMove', () => {
        let testState: ChessState;

        beforeEach(() => {
            testState = createStateWithGame() as ChessState;
        });

        it('should execute regular move successfully when piece exists', () => {
            const mockPiece = createPiece();
            const mockMoveResult = { from: 'e2', to: 'e4', san: 'e4' };

            mockChessInstance.get.mockReturnValue(mockPiece);
            mockChessInstance.move.mockReturnValue(mockMoveResult);

            const action = attemptMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(testState, action);

            expect(mockChessInstance.move).toHaveBeenCalledWith({ from: 'e2', to: 'e4' });
            expect(state.history).toContain(mockMoveResult);
            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
        });

        it('should not execute move when piece does not exist on source square', () => {
            mockChessInstance.get.mockReturnValue(null);

            const action = attemptMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(testState, action);

            expect(mockChessInstance.move).not.toHaveBeenCalled();
            expect(state.history).toEqual([]);
        });

        it('should handle pawn promotion for white pawn moving to 8th rank', () => {
            const mockPiece = createPiece('p', 'w', 'e7');
            mockChessInstance.get.mockReturnValue(mockPiece);

            const action = attemptMove({ from: 'e7', to: 'e8' });
            const state = chessReducer(testState, action);

            expect(mockChessInstance.move).not.toHaveBeenCalled();
        });

        it('should handle pawn promotion for black pawn moving to 1st rank', () => {
            const mockPiece = createPiece('p', 'b', 'e2');
            mockChessInstance.get.mockReturnValue(mockPiece);

            const action = attemptMove({ from: 'e2', to: 'e1' });
            const state = chessReducer(testState, action);

            expect(mockChessInstance.move).not.toHaveBeenCalled();
        });

        it('should handle invalid move gracefully and log error', () => {
            const mockPiece = createPiece();
            const mockError = new Error('Invalid move');

            mockChessInstance.get.mockReturnValue(mockPiece);
            mockChessInstance.move.mockImplementation(() => {
                throw mockError;
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const action = attemptMove({ from: 'e2', to: 'e5' });
            const state = chessReducer(testState, action);

            expect(consoleSpy).toHaveBeenCalledWith('Error attempting move: ', mockError);
            expect(state).toEqual(testState);

            consoleSpy.mockRestore();
        });

        it('should return early when game is not initialized', () => {
            const stateWithoutGame: ChessState = { ...initialState, game: null };

            const action = attemptMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(stateWithoutGame, action);

            expect(state).toEqual(stateWithoutGame);
            expect(mockChessInstance.get).not.toHaveBeenCalled();
        });
    });

    describe('executePromotion', () => {
        let testState: ChessState;

        beforeEach(() => {
            testState = {
                ...createStateWithGame(),
                promotionInfo: { from: 'e7', to: 'e8', color: 'w' },
                activePiece: createPiece('p', 'w', 'e7'),
                possibleMoves: ['e8'],
            } as ChessState;
        });

        it('should execute promotion successfully with specified piece', () => {
            const mockMoveResult = { from: 'e7', to: 'e8', promotion: 'q', san: 'e8=Q' };
            mockChessInstance.move.mockReturnValue(mockMoveResult);

            const action = executePromotion('q');
            const state = chessReducer(testState, action);

            expect(mockChessInstance.move).toHaveBeenCalledWith({
                from: 'e7',
                to: 'e8',
                promotion: 'q',
            });
            expect(state.history).toContain(mockMoveResult);
            expect(state.promotionInfo).toBeNull();
            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
        });

        it('should clear promotion state even when move fails', () => {
            const mockError = new Error('Invalid promotion');
            mockChessInstance.move.mockImplementation(() => {
                throw mockError;
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const action = executePromotion('q');
            const state = chessReducer(testState, action);

            expect(consoleSpy).toHaveBeenCalledWith('Error attempting move with promotion ', mockError);
            expect(state.promotionInfo).toBeNull();

            consoleSpy.mockRestore();
        });

        it('should not execute when promotion info is missing', () => {
            const stateWithoutPromotion: ChessState = {
                ...createStateWithGame(),
                promotionInfo: null,
            } as ChessState;

            const action = executePromotion('q');
            const state = chessReducer(stateWithoutPromotion, action);

            expect(mockChessInstance.move).not.toHaveBeenCalled();
        });

        it('should not execute when game is not initialized', () => {
            const stateWithoutGame: ChessState = {
                ...initialState,
                promotionInfo: { from: 'e7', to: 'e8', color: 'w' },
            };

            const action = executePromotion('q');
            const state = chessReducer(stateWithoutGame, action);

            expect(state).toEqual(stateWithoutGame);
        });
    });

    describe('cancelPromotion', () => {
        it('should clear promotion info when called', () => {
            const stateWithPromotion: ChessState = {
                ...initialState,
                promotionInfo: { from: 'e7', to: 'e8', color: 'w' },
            };

            const action = cancelPromotion();
            const state = chessReducer(stateWithPromotion, action);

            expect(state.promotionInfo).toBeNull();
        });

        it('should not affect other state properties', () => {
            const stateWithPromotion: ChessState = {
                ...initialState,
                promotionInfo: { from: 'e7', to: 'e8', color: 'w' },
                activePiece: createPiece(),
                possibleMoves: ['e3', 'e4'],
            };

            const action = cancelPromotion();
            const state = chessReducer(stateWithPromotion, action);

            expect(state.promotionInfo).toBeNull();
            expect(state.activePiece).toEqual(createPiece());
            expect(state.possibleMoves).toEqual(['e3', 'e4']);
        });
    });

    describe('makeMove', () => {
        let testState: ChessState;

        beforeEach(() => {
            testState = {
                ...createStateWithGame(),
                activePiece: createPiece(),
                possibleMoves: ['e3', 'e4'],
            } as ChessState;
        });

        it('should execute move and update state successfully', () => {
            const mockMoveResult = { from: 'e2', to: 'e4', san: 'e4' };
            mockChessInstance.move.mockReturnValue(mockMoveResult);

            const action = makeMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(testState, action);

            expect(mockChessInstance.move).toHaveBeenCalledWith({ from: 'e2', to: 'e4' });
            expect(state.history).toContain(mockMoveResult);
            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
        });

        it('should handle move with promotion parameter', () => {
            const mockMoveResult = { from: 'e7', to: 'e8', promotion: 'q', san: 'e8=Q' };
            mockChessInstance.move.mockReturnValue(mockMoveResult);

            const action = makeMove({ from: 'e7', to: 'e8', promotion: 'q' });
            const state = chessReducer(testState, action);

            expect(mockChessInstance.move).toHaveBeenCalledWith({
                from: 'e7',
                to: 'e8',
                promotion: 'q'
            });
            expect(state.history).toContain(mockMoveResult);
        });

        it('should log error and maintain state when move is invalid', () => {
            const mockError = new Error('Invalid move');
            mockChessInstance.move.mockImplementation(() => {
                throw mockError;
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const action = makeMove({ from: 'e2', to: 'e5' });
            const state = chessReducer(testState, action);

            expect(consoleSpy).toHaveBeenCalledWith('Invalid move:', mockError);
            expect(state.history).toEqual(testState.history);

            consoleSpy.mockRestore();
        });

        it('should not execute when game is not initialized', () => {
            const stateWithoutGame: ChessState = { ...initialState, game: null };

            const action = makeMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(stateWithoutGame, action);

            expect(state).toEqual(stateWithoutGame);
        });
    });

    describe('loadGameFromFEN', () => {
        it('should load game from valid FEN string', () => {
            const customFEN = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';

            const action = loadGameFromFEN(customFEN);
            const state = chessReducer(initialState, action);

            expect(MockedChess).toHaveBeenCalledWith(customFEN);
            expect(state.game).toBeDefined();
            expect(mockGetGameStatus).toHaveBeenCalledWith(mockChessInstance);
        });

        it('should handle invalid FEN gracefully and log error', () => {
            const mockError = new Error('Invalid FEN');
            MockedChess.mockImplementation(() => {
                throw mockError;
            });

            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

            const action = loadGameFromFEN('invalid-fen-string');
            const state = chessReducer(initialState, action);

            expect(consoleSpy).toHaveBeenCalledWith('Error loading game from FEN:', mockError);
            expect(state).toEqual(initialState);

            consoleSpy.mockRestore();
        });
    });

    describe('undoMove', () => {
        let testState: ChessState;

        beforeEach(() => {
            testState = {
                ...createStateWithGame(),
                activePiece: createPiece('p', 'w', 'e4'),
                possibleMoves: ['e5'],
                promotionInfo: { from: 'e7', to: 'e8', color: 'w' },
            } as ChessState;
        });

        it('should undo move when move history exists', () => {
            mockChessInstance.history.mockReturnValue(['e4', 'e5']);

            const action = undoMove();
            const state = chessReducer(testState, action);

            expect(mockChessInstance.undo).toHaveBeenCalled();
            expect(mockGetGameStatus).toHaveBeenCalledWith(mockChessInstance);
            expect(state.promotionInfo).toBeNull();
            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
        });

        it('should not undo when no move history exists', () => {
            mockChessInstance.history.mockReturnValue([]);

            const action = undoMove();
            const state = chessReducer(testState, action);

            expect(mockChessInstance.undo).not.toHaveBeenCalled();
            expect(mockGetGameStatus).not.toHaveBeenCalled();
        });

        it('should not execute when game is not initialized', () => {
            const stateWithoutGame: ChessState = { ...initialState, game: null };

            const action = undoMove();
            const state = chessReducer(stateWithoutGame, action);

            expect(state).toEqual(stateWithoutGame);
        });
    });

    describe('setActivePiece', () => {
        let testState: ChessState;

        beforeEach(() => {
            testState = {
                ...createStateWithGame(),
                gameState: createMockGameState({ turn: 'w' }),
            } as ChessState;
        });

        it('should set active piece and calculate possible moves', () => {
            const piece = createPiece();
            const mockMoves = [
                { to: 'e3', from: 'e2', san: 'e3' },
                { to: 'e4', from: 'e2', san: 'e4' },
            ];

            mockChessInstance.moves.mockReturnValue(mockMoves);

            const action = setActivePiece(piece);
            const state = chessReducer(testState, action);

            expect(mockChessInstance.moves).toHaveBeenCalledWith({
                square: 'e2',
                verbose: true,
            });
            expect(state.activePiece).toEqual(piece);
            expect(state.possibleMoves).toEqual(['e3', 'e4']);
        });

        it('should clear active piece when null is provided', () => {
            const stateWithActivePiece: ChessState = {
                ...testState,
                activePiece: createPiece(),
                possibleMoves: ['e3', 'e4'],
            };

            const action = setActivePiece(null as any);
            const state = chessReducer(stateWithActivePiece, action);

            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
            expect(mockChessInstance.moves).not.toHaveBeenCalled();
        });

        it('should toggle active piece when same piece is clicked again', () => {
            const piece = createPiece();
            const stateWithActivePiece: ChessState = {
                ...testState,
                activePiece: piece,
                possibleMoves: ['e3', 'e4'],
            };

            const action = setActivePiece(piece);
            const state = chessReducer(stateWithActivePiece, action);

            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
        });

        it('should not allow setting active piece for opponent turn', () => {
            const blackPiece = createPiece('p', 'b', 'e7');
            const stateWithWhiteTurn: ChessState = {
                ...testState,
                gameState: createMockGameState({ turn: 'w' }),
            };

            const action = setActivePiece(blackPiece);
            const state = chessReducer(stateWithWhiteTurn, action);

            expect(state.activePiece).toBeNull();
            expect(mockChessInstance.moves).not.toHaveBeenCalled();
        });

        it('should not execute when game is not initialized', () => {
            const stateWithoutGame: ChessState = { ...initialState, game: null };
            const piece = createPiece();

            const action = setActivePiece(piece);
            const state = chessReducer(stateWithoutGame, action);

            expect(state.activePiece).toBeNull();
        });
    });

    describe('clearActivePiece', () => {
        it('should clear active piece and possible moves', () => {
            const stateWithActivePiece: ChessState = {
                ...initialState,
                activePiece: createPiece(),
                possibleMoves: ['e3', 'e4'],
            };

            const action = clearActivePiece();
            const state = chessReducer(stateWithActivePiece, action);

            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
        });

        it('should not affect other state properties', () => {
            const stateWithActivePiece: ChessState = {
                ...initialState,
                activePiece: createPiece(),
                possibleMoves: ['e3', 'e4'],
                player: 'b',
                isSinglePlayer: false,
            };

            const action = clearActivePiece();
            const state = chessReducer(stateWithActivePiece, action);

            expect(state.activePiece).toBeNull();
            expect(state.possibleMoves).toEqual([]);
            expect(state.player).toBe('b');
            expect(state.isSinglePlayer).toBe(false);
        });
    });

    describe('clearPossibleMoves', () => {
        it('should clear possible moves while preserving active piece', () => {
            const activePiece = createPiece();
            const stateWithMoves: ChessState = {
                ...initialState,
                activePiece,
                possibleMoves: ['e3', 'e4'],
            };

            const action = clearPossibleMoves();
            const state = chessReducer(stateWithMoves, action);

            expect(state.possibleMoves).toEqual([]);
            expect(state.activePiece).toEqual(activePiece);
        });
    });

    describe('resetFullGame', () => {
        it('should reset all state to initial values', () => {
            const modifiedState: ChessState = {
                ...initialState,
                game: mockChessInstance as any,
                player: 'b',
                isSinglePlayer: false,
                activePiece: createPiece(),
                possibleMoves: ['e3', 'e4'],
                history: [{ from: 'e2', to: 'e4' } as any],
                gameEndReason: 'Test end reason',
            };

            const action = resetFullGame();
            const state = chessReducer(modifiedState, action);

            expect(state).toEqual(initialState);
        });
    });

    describe('Game End State Management', () => {
        let testState: ChessState;

        beforeEach(() => {
            testState = createStateWithGame() as ChessState;
        });

        it('should set checkmate message when white wins', () => {
            const checkmateGameState = createMockGameState({
                isGameOver: true,
                gameState: 'CheckMate',
                turn: 'b', // Black to move, so white wins
            });

            mockGetGameStatus.mockReturnValue(checkmateGameState);
            mockChessInstance.move.mockReturnValue({ from: 'e2', to: 'e4', san: 'e4' });

            const action = makeMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(testState, action);

            expect(state.gameEndReason).toBe('Checkmate! White wins.');
        });

        it('should set checkmate message when black wins', () => {
            const checkmateGameState = createMockGameState({
                isGameOver: true,
                gameState: 'CheckMate',
                turn: 'w', // White to move, so black wins
            });

            mockGetGameStatus.mockReturnValue(checkmateGameState);
            mockChessInstance.move.mockReturnValue({ from: 'e7', to: 'e5', san: 'e5' });

            const action = makeMove({ from: 'e7', to: 'e5' });
            const state = chessReducer(testState, action);

            expect(state.gameEndReason).toBe('Checkmate! Black wins.');
        });

        it('should set stalemate message for draw by stalemate', () => {
            const stalemateGameState = createMockGameState({
                isGameOver: true,
                gameState: 'StaleMate',
            });

            mockGetGameStatus.mockReturnValue(stalemateGameState);
            mockChessInstance.move.mockReturnValue({ from: 'e2', to: 'e4', san: 'e4' });

            const action = makeMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(testState, action);

            expect(state.gameEndReason).toBe('Draw by stalemate.');
        });

        it('should set insufficient material message for material draw', () => {
            const drawGameState = createMockGameState({
                isGameOver: true,
                gameState: 'Draw',
            });

            mockGetGameStatus.mockReturnValue(drawGameState);
            mockChessInstance.move.mockReturnValue({ from: 'e2', to: 'e4', san: 'e4' });
            mockChessInstance.isInsufficientMaterial.mockReturnValue(true);

            const action = makeMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(testState, action);

            expect(state.gameEndReason).toBe('Draw by insufficient material.');
        });

        it('should set threefold repetition message for repetition draw', () => {
            const drawGameState = createMockGameState({
                isGameOver: true,
                gameState: 'Draw',
            });

            mockGetGameStatus.mockReturnValue(drawGameState);
            mockChessInstance.move.mockReturnValue({ from: 'e2', to: 'e4', san: 'e4' });
            mockChessInstance.isInsufficientMaterial.mockReturnValue(false);
            mockChessInstance.isThreefoldRepetition.mockReturnValue(true);

            const action = makeMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(testState, action);

            expect(state.gameEndReason).toBe('Draw by threefold repetition.');
        });

        it('should default to 50-move rule message for other draws', () => {
            const drawGameState = createMockGameState({
                isGameOver: true,
                gameState: 'Draw',
            });

            mockGetGameStatus.mockReturnValue(drawGameState);
            mockChessInstance.move.mockReturnValue({ from: 'e2', to: 'e4', san: 'e4' });
            mockChessInstance.isInsufficientMaterial.mockReturnValue(false);
            mockChessInstance.isThreefoldRepetition.mockReturnValue(false);

            const action = makeMove({ from: 'e2', to: 'e4' });
            const state = chessReducer(testState, action);

            expect(state.gameEndReason).toBe('Draw by 50-move rule.');
        });
    });
});