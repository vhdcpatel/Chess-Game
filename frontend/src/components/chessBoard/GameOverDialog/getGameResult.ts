import { Color } from 'chess.js';
import styles from './GameOverDialog.module.css';
import { GameState } from './GameOverDialog';

const resultTextMap = {
  CheckMate: (turn: Color) => {
    const winner = turn === 'w' ? 'Black' : 'White';
    return {
      title: '🏆 Game Over - Checkmate!',
      message: `${winner} wins by checkmate!`,
    };
  },
  StaleMate: {
    title: '🤝 Game Over - Stalemate!',
    message: 'The game ends in a draw by stalemate.',
  },
  Draw: (reason: string | null) => ({
    title: '🤝 Game Over - Draw!',
    message: reason || 'The game ends in a draw.',
  }),
  Default: {
    title: '🎯 Game Over',
    message: 'The game has ended.',
  },
};

export const getGameResult = (gameState: GameState, turn: Color, gameEndReason: string | null = null) => {
  switch (gameState) {
    case 'CheckMate':
      return {
        ...resultTextMap.CheckMate(turn),
        resultClass: styles.winResult,
      };
    case 'StaleMate':
      return {
        ...resultTextMap.StaleMate,
        resultClass: styles.drawResult,
      };
    case 'Draw':
      return {
        ...resultTextMap.Draw(gameEndReason),
        resultClass: styles.drawResult,
      };
    default:
      return {
        ...resultTextMap.Default,
        resultClass: styles.defaultResult,
      };
  }
};
