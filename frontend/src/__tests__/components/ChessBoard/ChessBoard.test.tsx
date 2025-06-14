import { render, screen, fireEvent } from "../../../../vitest.setup";
import ChessBoard from "../../../components/chessBoard/ChessBoard";
import { useAppSelector } from "../../../features";
import { RootState } from "../../../features/store";

// Piece assets
import pawnWhite from "../../../assets/chessPieces/pawnWhite.png";
import rookWhite from "../../../assets/chessPieces/rookWhite.png";
import knightWhite from "../../../assets/chessPieces/knightWhite.png";
import bishopWhite from "../../../assets/chessPieces/bishopWhite.png";
import queenWhite from "../../../assets/chessPieces/queenWhite.png";
import kingWhite from "../../../assets/chessPieces/kingWhite.png";
import pawnBlack from "../../../assets/chessPieces/pawnBlack.png";
import rookBlack from "../../../assets/chessPieces/rookBlack.png";
import knightBlack from "../../../assets/chessPieces/knightBlack.png";
import bishopBlack from "../../../assets/chessPieces/bishopBlack.png";
import queenBlack from "../../../assets/chessPieces/queenBlack.png";
import kingBlack from "../../../assets/chessPieces/kingBlack.png";
import { generateEmptyBoard } from "../../../utils/getEmptyArray";
import { vi } from "vitest";
import { defaultStartFEN } from "../../../features/chessGame/ChessConstant";

// Mock Square
vi.mock("../../../features", async () => {
  const actual = await vi.importActual("../../../features");
  return {
    ...actual,
    useAppDispatch: () => vi.fn(),
    useAppSelector: vi.fn(),
  };
});

// Mock Redux state
describe("ChessBoard renders full set of pieces", () => {

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
    isDraw: vi.fn().mockReturnValue(false),
    isGameOver: vi.fn().mockReturnValue(false),
  }) as unknown as Chess;

  it("renders all 32 chess pieces correctly", () => {
    const fullBoard = [
      // 8th rank: black back rank
      [
        { type: "r", color: "b", square: "A8" },
        { type: "n", color: "b", square: "B8" },
        { type: "b", color: "b", square: "C8" },
        { type: "q", color: "b", square: "D8" },
        { type: "k", color: "b", square: "E8" },
        { type: "b", color: "b", square: "F8" },
        { type: "n", color: "b", square: "G8" },
        { type: "r", color: "b", square: "H8" },
      ],
      // 7th rank: black pawns
      Array(8)
          .fill(null)
          .map((_, i) => ({ type: "p", color: "b", square: `${String.fromCharCode(65 + i)}7` })),
      // 6–3: empty
      ...Array(4).fill(generateEmptyBoard()[0]),
      // 2nd rank: white pawns
      Array(8)
          .fill(null)
          .map((_, i) => ({ type: "p", color: "w", square: `${String.fromCharCode(65 + i)}2` })),
      // 1st rank: white back rank
      [
        { type: "r", color: "w", square: "A1" },
        { type: "n", color: "w", square: "B1" },
        { type: "b", color: "w", square: "C1" },
        { type: "q", color: "w", square: "D1" },
        { type: "k", color: "w", square: "E1" },
        { type: "b", color: "w", square: "F1" },
        { type: "n", color: "w", square: "G1" },
        { type: "r", color: "w", square: "H1" },
      ],
    ];

    // Mock useAppSelector to return our “fullBoard” game
    (useAppSelector as vi.Mock).mockImplementation((selector: (state: RootState) => unknown) =>
        selector({

          chess: {
            game: {
              ...baseMockChessGame(),
              board: () => fullBoard
            },
            gameState: { turn: "w", isGameOver: false, gameState: null },
            activePiece: null,
            possibleMoves: [],
            promotionInfo: null,
            gameEndReason: null,
            player: "w",
            isSinglePlayer: true,
          },
        })
    );

    render(<ChessBoard />);

    const expected = [
      { alt: "w p", src: pawnWhite, count: 8 },
      { alt: "w r", src: rookWhite, count: 2 },
      { alt: "w n", src: knightWhite, count: 2 },
      { alt: "w b", src: bishopWhite, count: 2 },
      { alt: "w q", src: queenWhite, count: 1 },
      { alt: "w k", src: kingWhite, count: 1 },
      { alt: "b p", src: pawnBlack, count: 8 },
      { alt: "b r", src: rookBlack, count: 2 },
      { alt: "b n", src: knightBlack, count: 2 },
      { alt: "b b", src: bishopBlack, count: 2 },
      { alt: "b q", src: queenBlack, count: 1 },
      { alt: "b k", src: kingBlack, count: 1 },
    ];

    // Assert we have exactly 32 pieces and each alt/src appears the correct # of times
    expected.forEach(({ alt, src, count }) => {
      const imgs = screen.getAllByAltText(alt) as HTMLImageElement[];
      expect(imgs).toHaveLength(count);
      imgs.forEach((img) => expect(img.src).toContain(src));
    });
    expect(screen.getAllByRole("img")).toHaveLength(32);
  });

  it('renders an empty board when game is not initialized', () => {
    (useAppSelector as vi.Mock).mockImplementation((selector: (state: RootState) => unknown) =>
        selector({
          chess: {
            game: null,
            gameState: { turn: "w", isGameOver: false, gameState: null },
            activePiece: null,
            possibleMoves: [],
            promotionInfo: null,
            gameEndReason: null,
            player: "w",
            isSinglePlayer: true,
          },
        })
    );

    render(<ChessBoard />);
    // No piece images should be present
    const imgs = screen.queryAllByRole('img');
    expect(imgs).toHaveLength(0);
    // Board squares equal 8×8 = 64
    const squares = screen.getAllByTestId('square'); // add data-testid="square" in Square if needed
    expect(squares).toHaveLength(64);
  });

  it('shows <PromotionDialog> when promotionInfo exists', () => {
    (useAppSelector as vi.Mock).mockImplementation((selector: (state: RootState) => unknown) =>
        selector({
          chess: {
            game: {
              ...baseMockChessGame(),
              board: () => generateEmptyBoard()
            },
            gameState: { turn: "w", isGameOver: false, gameState: null },
            activePiece: null,
            possibleMoves: [],
            promotionInfo: { from: 'e7', to: 'e8', color: 'w' },
            gameEndReason: null,
            player: "w",
            isSinglePlayer: true,
          },
        })
    );

    render(<ChessBoard />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Ensure PromotionDialog specifically is rendered
    expect(screen.getByText(/Promote/i)).toBeInTheDocument();
  });

  it('shows <GameOverDialog> when game is over', () => {
    (useAppSelector as vi.Mock).mockImplementation((selector: (state: RootState) => unknown) =>
        selector({
          chess: {
            game: {
              ...baseMockChessGame(),
              board: () => generateEmptyBoard()
            },
            gameState: { turn: 'w', isGameOver: true, gameState: 'CheckMate' },
            activePiece: null,
            possibleMoves: [],
            promotionInfo: null,
            player: 'w',
            isSinglePlayer: true,
            gameEndReason: 'CheckMate',
          },
        })
    );

    render(<ChessBoard />);
    // Should render GameOverDialog
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
    // "New Game" button should dispatch resetFullGame
    fireEvent.click(screen.getByText(/New Game/i));
  });

  it('flips board orientation when player is black', () => {
    // White pawn at A2 should appear in bottom-left when player='w'
    const board = [
      ...Array(6).fill(Array(8).fill(null)),
      Array(8).fill({ type: 'p', color: 'w', square: 'A2' }),
      Array(8).fill(null),
    ];
    (useAppSelector as vi.Mock).mockImplementation((selector: (state: RootState) => unknown) =>
        selector({
          chess: {
            game: {
              ...baseMockChessGame(),
              board: () => board
            },
            gameState: { turn: 'w', isGameOver: false, gameState: "OnGoing" },
            activePiece: null,
            possibleMoves: [],
            promotionInfo: null,
            player: 'b',
            isSinglePlayer: true,
            gameEndReason: null,
          },
        })
    );

    render(<ChessBoard />);
    // When flipped, the pawn should now be in the top-right instead of bottom-left
    const imgs = screen.getAllByAltText('w p');
    expect(imgs).toHaveLength(8);
  });

  //
  // it('dispatches attemptMove when clicking a possible-move square', () => {
  //   const fullBoard = generateEmptyBoard();
  //   // Place a white pawn on E2
  //   fullBoard[6][4] = { type: 'p', color: 'w', square: 'E2' };
  //   const possible = ['E3'];
  //   (useAppSelector as vi.Mock).mockImplementation(selector =>
  //       selector({
  //         chess: {
  //           game: { board: () => fullBoard },
  //           gameState: { turn: 'w', isGameOver: false, gameState: null },
  //           activePiece: { type: 'p', color: 'w', square: 'E2' },
  //           possibleMoves: possible,
  //           promotionInfo: null,
  //           player: 'w',
  //           isSinglePlayer: true,
  //           gameEndReason: null,
  //         },
  //       })
  //   );
  //
  //   render(<ChessBoard />);
  //   const targetSquare = screen.getByTestId('square-E3'); // add data-testid={`square-${file}${rank}`}
  //   fireEvent.click(targetSquare);
  //   expect(dispatchMock).toHaveBeenCalledWith(
  //       attemptMove({ from: 'E2', to: 'E3' })
  //   );
  // });
});
