import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PieceColor, PieceType, getSrc } from '../../../utils/constants/srcMap';
import Piece from '../../../components/pieces/Piece';

// Mocking the CSS module with default exports.
vi.mock('../../../components/pieces/Piece.module.css', () => ({
  default: {
    piece: 'mock-piece-class'
  }
}));

// Mocking the behavior getSrc function. 
vi.mock('../../utils/constants/srcMap', () => ({
  PieceColor: { WHITE: 'white', BLACK: 'black' },
  PieceType: { KING: 'king', QUEEN: 'queen' },
  getSrc: {
    white: { king: 'white-king.png', queen: 'white-queen.png' },
    black: { king: 'black-king.png', queen: 'black-queen.png' }
  }
}));

describe('Should render the piece component correctly.', () => {
  const defaultProps = {
    type: "p" as PieceType,
    color: "w" as PieceColor,
    position: "a1" ,
    active: false,
    setPossibleMove: vi.fn(),
    activePieceHandler: vi.fn(),
    isSinglePlayer: false,
    player: 'w' as 'w' | 'b',
  };

  it('renders correctly with given props', () => {
    render(<Piece  {...defaultProps} />);
    const pieceElement = screen.getByRole('img');

    expect(pieceElement).toHaveAttribute('src', getSrc[defaultProps.color][defaultProps.type]);
    expect(pieceElement).toHaveAttribute('alt', `${defaultProps.color} ${defaultProps.type}`);
  });

  it('has correct data-position attribute', () => {
    render(<Piece {...defaultProps} />);
    const pieceContainer = screen.getByRole('img').parentElement;

    expect(pieceContainer).toHaveAttribute('data-position', defaultProps.position);
  });

  it('triggers onDragStart with correct data', () => {
    render(<Piece {...defaultProps} />);
    const pieceElement = screen.getByRole('img');
    const dataTransfer = {
      setData: vi.fn()
    };
    
    fireEvent.dragStart(pieceElement, { dataTransfer });
    
    expect(dataTransfer.setData).toHaveBeenCalledWith(
      'application/json',
      JSON.stringify({
        type: defaultProps.type,
        color: defaultProps.color,
        position: defaultProps.position
      })
    );
  });

  it('applies the correct CSS class', () => {
    render(<Piece {...defaultProps} />);
    const pieceContainer = screen.getByRole('img').parentElement;

    expect(pieceContainer).toHaveClass('mock-piece-class');
  });

  it('renders the correct image for different piece types and colors', () => {
    const newProps = { ...defaultProps, type: 'queen' as PieceType, color: 'black' as PieceColor };
    render(<Piece {...newProps} />);
    const pieceElement = screen.getByRole('img');

    expect(pieceElement).toHaveAttribute('src', getSrc[newProps.color][newProps.type]);
    expect(pieceElement).toHaveAttribute('alt', `${newProps.color} ${newProps.type}`);
  });
});
