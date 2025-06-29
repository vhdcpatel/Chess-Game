import React from 'react';
import { Button } from '@mui/material';
import styles from './GameOverDialog.module.css';
import GenericDialog from "../../dialogBox/GenericDialog";

type Color = 'w' | 'b';
type GameState = 'OnGoing' | 'Check' | 'CheckMate' | 'StaleMate' | 'Draw';

interface GameStatus {
    turn: Color;
    gameState: GameState;
    isGameOver: boolean;
}

interface GameOverDialogProps {
    isOpen: boolean;
    gameStatus: GameStatus;
    gameEndReason: string | null;
    onNewGame: () => void;
    onMainMenu: () => void;
    onDownloadPGN?: () => void;
}

const GameOverDialog: React.FC<GameOverDialogProps> = (props) => {
    const {
        isOpen,
        gameStatus,
        gameEndReason,
        onNewGame,
        onMainMenu,
        onDownloadPGN,
    } = props;

    const getGameResult = () => {
        switch (gameStatus.gameState) {
            case 'CheckMate':
                const winner = gameStatus.turn === 'w' ? 'Black' : 'White';
                return {
                    title: '🏆 Game Over - Checkmate!',
                    message: `${winner} wins by checkmate!`,
                    resultClass: styles.winResult
                };
            case 'StaleMate':
                return {
                    title: '🤝 Game Over - Stalemate!',
                    message: 'The game ends in a draw by stalemate.',
                    resultClass: styles.drawResult
                };
            case 'Draw':
                return {
                    title: '🤝 Game Over - Draw!',
                    message: gameEndReason || 'The game ends in a draw.',
                    resultClass: styles.drawResult
                };
            default:
                return {
                    title: '🎯 Game Over',
                    message: 'The game has ended.',
                    resultClass: styles.defaultResult
                };
        }
    };

    const result = getGameResult();

    const dialogContent = (
        <>
            <div className={styles.outerCtn}>
                <div className={styles.resultContainer}>
                    <h2 className={`${styles.resultTitle} ${result.resultClass}`}>
                        {result.title}
                    </h2>
                    <p className={styles.resultMessage}>
                        {result.message}
                    </p>
                    {gameEndReason && gameStatus.gameState !== 'Draw' && (
                        <p className={styles.reasonText}>
                            Reason: {gameEndReason}
                        </p>
                    )}
                </div>
            </div>

            <div className={styles.outerCtn}>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Final Turn:</span>
                        <span className={styles.statValue}>
              {gameStatus.turn === 'w' ? 'White' : 'Black'}
            </span>
                    </div>
                </div>
            </div>

            <div className={`${styles.outerCtn} ${styles.actionBox}`}>
                <div className={styles.actionBoxInner}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onNewGame}
                        className={styles.primaryButton}
                    >
                        New Game
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onMainMenu}
                        className={styles.secondaryButton}
                    >
                        Main Menu
                    </Button>
                    {onDownloadPGN && (
                        <Button
                            variant="text"
                            onClick={onDownloadPGN}
                            className={styles.textButton}
                        >
                            Download PGN
                        </Button>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <GenericDialog
            isOpen={isOpen}
            title="Game Complete"
            onClose={onDownloadPGN}
            maxWidth="sm"
        >
            {dialogContent}
        </GenericDialog>
    );
};

export default GameOverDialog;