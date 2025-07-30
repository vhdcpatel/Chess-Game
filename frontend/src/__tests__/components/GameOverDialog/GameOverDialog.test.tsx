import { render, screen } from '@testing-library/react';
import GameOverDialog, { Color, GameState } from '../../../components/chessBoard/GameOverDialog/GameOverDialog';


const mockNewGame = vi.fn();
const mockMainMenu = vi.fn();
const mockDownloadPGN = vi.fn();

const baseProps = {
  isOpen: true,
  gameStatus: {
    turn: 'w' as Color,
    gameState: 'CheckMate' as GameState,
    isGameOver: true,
  },
  gameEndReason: 'Time out',
  onNewGame: mockNewGame,
  onMainMenu: mockMainMenu,
  onDownloadPGN: mockDownloadPGN,
};

describe('GameOverDialog', () => {
  it('renders CheckMate result with correct winner', () => {
    render(<GameOverDialog {...baseProps} />);

    expect(screen.getByText('🏆 Game Over - Checkmate!')).toBeInTheDocument();
    expect(screen.getByText('Black wins by checkmate!')).toBeInTheDocument();
    expect(screen.getByText('Reason: Time out')).toBeInTheDocument();
    expect(screen.getByText('Final Turn:')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
  });

  it('hides PGN button when onDownloadPGN is not passed', () => {
    const { queryByText } = render(
      <GameOverDialog {...baseProps} onDownloadPGN={undefined} />
    );

    expect(queryByText('Download PGN')).not.toBeInTheDocument();
  });

  it('renders Draw message with custom reason', () => {
    const drawProps = {
      ...baseProps,
      gameStatus: {
        turn: 'b' as Color,
        gameState: 'Draw' as GameState,
        isGameOver: true,
      },
    };

    render(<GameOverDialog {...drawProps} />);

    expect(screen.getByText('🤝 Game Over - Draw!')).toBeInTheDocument();
    expect(screen.getByText('Time out')).toBeInTheDocument();
    expect(screen.queryByText('Reason:')).not.toBeInTheDocument(); // no extra reason line
  });

  it('renders default title/message for unknown gameState', () => {
    const customProps = {
      ...baseProps,
      gameStatus: {
        turn: 'b' as Color,
        gameState: 'Check' as GameState,
        isGameOver: true,
      },
    };

    render(<GameOverDialog {...customProps} />);

    expect(screen.getByText('🎯 Game Over')).toBeInTheDocument();
    expect(screen.getByText('The game has ended.')).toBeInTheDocument();
  });

  it('calls appropriate callback on button clicks', () => {
    render(<GameOverDialog {...baseProps} />);

    screen.getByText('New Game').click();
    screen.getByText('Main Menu').click();
    screen.getByText('Download PGN').click();

    expect(mockNewGame).toHaveBeenCalledOnce();
    expect(mockMainMenu).toHaveBeenCalledOnce();
    expect(mockDownloadPGN).toHaveBeenCalledOnce();
  });
});
