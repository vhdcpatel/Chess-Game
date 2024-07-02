import { render, screen } from "../../../../vitest.setup";
import ChessBoard from "../../../components/chessBoard/ChessBoard";

// Mocking the Square component
vi.mock('../../../components/square/Square', () => {
  return {
    __esModule: true,
    default: function DummySquare(props: { rank: string, file: string }) {
      return <div data-testid="square">{props.rank}{props.file}</div>;
    }};
});


describe("For proper rendering of the chess board", () => {
  const buildExpectedSquares = (ranks: string[], files: string[]) => {
    const expectedSquares: string[] = [];
    files.forEach((file) => {
      ranks.forEach((rank) => {
        expectedSquares.push(`${rank}${file}`);
      });
    });
    return expectedSquares;
  };


  it("Should render the chess board", () => {
    render(<ChessBoard player="white" />);
    const chessBoard = screen.getAllByTestId('square');
    expect(chessBoard).toHaveLength(64);
  });

  // Not using the content so use class or some other workaround.
  it("Should render squares with correct ranks and files fow white player.", () => {
    render(<ChessBoard player="white" />);
    const squares = screen.getAllByTestId('square');

    const ranks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const files = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse();
    const expectedSquares = buildExpectedSquares(ranks, files);

    squares.forEach((square, index) => {
      expect(square).toHaveTextContent(expectedSquares[index]);
    });
  });

  it("Should render squares with correct ranks and files fow black player.", () => {
    render(<ChessBoard player="black" />);
    const squares = screen.getAllByTestId('square');

    const ranks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].reverse();
    const files = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const expectedSquares = buildExpectedSquares(ranks, files);

    squares.forEach((square, index) => {
      expect(square).toHaveTextContent(expectedSquares[index]);
    });
  });
});