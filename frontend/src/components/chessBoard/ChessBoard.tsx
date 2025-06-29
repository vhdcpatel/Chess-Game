import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Square from '../square/Square';
import { PieceInfoModel } from '../../utils/constants/initialPosition';
import { FILES, RANKS } from '../../utils/constants/ranksAndFiles';
import { Square as  SquareNames} from 'chess.js';
import Piece from '../pieces/Piece';
import { useAppDispatch, useAppSelector } from "../../features";
import {
    attemptMove,
    cancelPromotion,
    clearActivePiece,
    executePromotion,
    initGame,
    setActivePiece,
    startGame
} from "../../features/chessGame/chessSlice";
import { generateEmptyBoard } from "../../utils/getEmptyArray";
import PromotionDialog from "./PromotionDialog/PromotionDialog";
import { pieceTypeForPromotion } from "../../features/chessGame/chessModel";
import GameOverDialog from "./GameOverDialog/GameOverDialog";
import styles from './chessBoard.module.css';
import { useStockFish } from "../../hooks/useStockFish/useStockFish";
import { downloadPgnFile } from '../../utils/downloadFenToTxt';

const ChessBoard: React.FC = () => {

    // const { socket } = useSocket();
    const dispatch = useAppDispatch();

    // StockFish Hook for single player mode.
    useStockFish();

    const game = useAppSelector((state)=> state.chess.game);
    const gameState = useAppSelector((state)=> state.chess.gameState);
    const activePiece = useAppSelector((state)=> state.chess.activePiece);
    const possibleMoves = useAppSelector((state)=> state.chess.possibleMoves);
    const player = useAppSelector((state)=> state.chess.player);
    const isSinglePlayer = useAppSelector((state)=>state.chess.isSinglePlayer);
    const promotionInfo = useAppSelector((state)=> state.chess.promotionInfo);
    const gameStatus = useAppSelector((state)=> state.chess.gameState);
    const gameEndReason = useAppSelector((state)=> state.chess.gameEndReason);

    const isGameOver = gameStatus.isGameOver ?? false;

    // For Handling the Socket.io for the multiplayer game.
    // Will implement in the future.
    // Making Socket Disable Now.
    // useEffect(() => {
    //     if (socket) {
    //         socket.on('connect', () => {
    //             console.log('Connected to socket server');
    //         });
    //
    //         socket.on('move', (move) => {
    //             console.log('Received move:', move);
    //         });
    //
    //         return () => {
    //             socket.off('connect');
    //             socket.off('move');
    //         };
    //     }
    // }, [socket]);

    const handleMove = (sourceSquare: SquareNames, targetSquare: SquareNames)=>{
        // Updating the state of the game based on the move.
        // If not promotion move than move else give promotion Dialog box.
        dispatch(attemptMove({
            from: sourceSquare,
            to: targetSquare,
        }))
    }
    
    const onDropHandler = (item: PieceInfoModel, rank: string, file: string) => {
        handleMove(item.square, `${file}${rank}` as SquareNames);
    }

    const handleClick = (file: string, rank: string) => {
        handleMove(activePiece?.square as SquareNames, `${file}${rank}` as SquareNames);
    }

    // No need for useCallBack as we are calling it from 32 components only.
    const activePieceHandler = (type: "set" | "reset") => (pieceInfo?: PieceInfoModel) => {
        if (type === "reset") {
            dispatch(clearActivePiece());
            return;
        }

        // Only allow setting active piece if it's the current player's turn
        // and in single player mode, only allow if it's the human player's piece
        if (pieceInfo?.color === gameState.turn && (!isSinglePlayer || player === pieceInfo.color)) {
            dispatch(setActivePiece(pieceInfo));
        }
    };

    // Handlers for promotion dialog
    const handlePromotion = (piece: pieceTypeForPromotion) => {
        dispatch(executePromotion(piece));
    };

    const handlePromotionCancel = () => {
        dispatch(cancelPromotion());
    };

    const handleNewGame = () => {
        dispatch(initGame());
        dispatch(startGame({player, isSinglePlayer}));
        // Any additional logic for starting a new game
    };

    const handleMainMenu = () => {
        // future implementation.
        // dispatch(returnToMainMenu());
        // Navigate to main menu or reset to initial state
    };

    const handleFenDownload = () => {
        // You might want to just show the final board state
        if(game === null){
            console.error('Game is null, cannot close game over dialog');
            return;
        }
        downloadPgnFile(game, 'game.pgn');
    };

    // Handle the render board based on the player.
    // (Memorize to save compute on each render.)
    const { filesToRender, ranksToRender } = React.useMemo(() => {
        const files = player === 'w' ? FILES : [...FILES].reverse();
        const ranks = player === 'w' ? RANKS : [...RANKS].reverse();
        return { filesToRender: files, ranksToRender: ranks };
    }, [player]);

    const boardPosition = !game
        ? generateEmptyBoard()
        : player === 'w'
            ? game.board()
            : game.board().map(row => row.reverse()).reverse();
    
    return (
        <React.Fragment>
            {(promotionInfo!== null) &&
                <PromotionDialog
                    promotionInfo={promotionInfo}
                    onPromote={handlePromotion}
                    onCancel={handlePromotionCancel}
                />
            }
            {(isGameOver && gameEndReason !== null) && <GameOverDialog
                isOpen={isGameOver}
                gameStatus={gameStatus}
                gameEndReason={gameEndReason}
                onNewGame={handleNewGame}
                onMainMenu={handleMainMenu}
                onDownloadFen={handleFenDownload}
            />}

            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className={styles.mainOuterCtn}>
                {ranksToRender.map((rank,RankIndex) =>
                    <div key={rank} className={styles.ranks} >
                        {filesToRender.map((file,FileIndex) => {
                        const piece = boardPosition[RankIndex][FileIndex];
                        const isCheckOrMate =
                            (gameState.gameState === "Check" || gameState.gameState==="CheckMate") &&
                            gameState.turn === piece?.color && piece?.type === 'k';

                        return (
                            <Square
                                key={`${rank}${file}`}
                                file={file}
                                rank={String(rank)}
                                onClick={handleClick}
                                onDrop={onDropHandler}
                                isPossibleMove={possibleMoves.includes(`${file}${rank}`)}
                                isActive={activePiece?.square === `${file}${rank}`}
                                isCheckOrMate={isCheckOrMate}
                            >
                                {piece && (
                                    <Piece
                                        type={piece.type}
                                        color={piece.color}
                                        position={piece.square}
                                        active={activePiece?.square === piece.square}
                                        isSinglePlayer={isSinglePlayer}
                                        player={player}
                                        activePieceHandler={activePieceHandler}
                                    />
                                )}
                            </Square>
                        );
                    })}
                    </div>
                )}
            </div>
        </DndProvider>
        </React.Fragment>
    );
};

export default ChessBoard;
