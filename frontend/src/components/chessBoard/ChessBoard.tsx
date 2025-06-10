import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Square from '../square/Square';
import styles from './chessBoard.module.css';
import { PieceInfoModel } from '../../utils/constants/initialPosition';
import { FILES, RANKS } from '../../utils/constants/ranksAndFiles';
import { Chess, Move, PieceSymbol, Square as  SquareNames} from 'chess.js';
import Piece from '../pieces/Piece';
import { getPromotionPieceHandler } from '../../utils/constants/handleMoves';
import getGameStatus from '../../utils/getGameStatus';
import { getBestMoveNew } from '../../utils/miniMax/getBestMove';
import { useAppDispatch, useAppSelector } from "../../features";
import {
    attemptMove, cancelPromotion,
    clearPossibleMoves,
    executePromotion,
    initGame,
    setActivePiece
} from "../../features/chessGame/chessSlice";
import { generateEmptyBoard } from "../../utils/getEmptyArray";
import PromotionDialog from "./PromotionDialog/PromotionDialog";
import { pieceTypeForPromotion } from "../../features/chessGame/chessModel";
// import useSocket from '../../context/authContext/SocketContext';
// import { useAppDispatch, useAppSelector } from '../../features';



const ChessBoard: React.FC = () => {

    // const { socket } = useSocket();
    const dispatch = useAppDispatch();


    useEffect(() => {
        // At the start of the game.
        dispatch(initGame());
    }, []);

    const game = useAppSelector((state)=> state.chess.game);
    const gameState = useAppSelector((state)=> state.chess.gameState);
    const activePiece = useAppSelector((state)=> state.chess.activePiece);
    const possibleMoves = useAppSelector((state)=> state.chess.possibleMoves);
    const player = useAppSelector((state)=> state.chess.player);
    const isSinglePlayer = useAppSelector((state)=>state.chess.isSinglePlayer);
    const promotionInfo = useAppSelector((state)=> state.chess.promotionInfo);

    // dispatch(setActivePiece(activePiece));
    // dispacth(setPossibleMoves(possibleMoves));
    // dispacth(setGameState(newGameState));

    // const [game, setGame] = useState<Chess>(new Chess(defaultStartFEN));
    // const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    // const [activePiece, setActivePiece] = useState<PieceInfoModel | null>(null);
    // const [gameState, setGameState] = useState<GameStatus>(initialStatus);
    // const [history, setHistory] = useState<Move[]>([]);
    // [from, to, piece, captured, promotion, flags, san, lan, before(fen), after*(fen)] array of all this thing.

    // For Handling the Socket.io for the multiplayer game.
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

    // Old Code for After move managements.
    // // This will run after update of game. (After each move.)
    // useEffect(()=>{
    //     const gameStatus = gameState.gameState;
    //     // Handling the checkMate, staleMate and Draw state currently.
    //     if(gameStatus === 'CheckMate'){
    //         setTimeout(()=>{
    //             alert(`CheckMate ${gameState.turn === 'w' ? 'black':'white'} won the game`);
    //         },0);
    //         // setGame(new Chess(defaultStartFEN));
    //     }else if(gameStatus === 'Draw'){
    //         alert(`Game Draw`);
    //     }else if(gameStatus === 'StaleMate'){
    //         alert(`StaleMate Positions for the ${gameState.turn === 'b' ? 'Black':'White'} player.`);
    //     }
    //
    //     // If single player then find the move for the computer.
    //     // (putting here so it can not block state update of the other side.)
    //     if(isSinglePlayer){
    //         if(gameStatus === "OnGoing" && game.turn() !== player){
    //             // CPU intensive task.
    //             const moveInfo = getBestMoveNew(game,player,3,gameState.globalSum);
    //             setGameState((prev)=>({...prev, globalSum: moveInfo[2]}));
    //
    //             const bestMove = moveInfo[0];
    //             if(bestMove){
    //                 const newGame = new Chess(game.fen());
    //                 const res = newGame.move(bestMove);
    //                 if(res){
    //                     setGame(newGame);
    //                     setHistory([...history, res]);
    //                 }
    //             }
    //         }
    //     }
    // },[gameState, isSinglePlayer, player]);
    //
    // // After game update status.
    // useEffect(()=>{
    //     const gameStatus = getGameStatus(game);
    //     setGameState((prev)=>({
    //         ...prev,
    //         turn: gameStatus.turn,
    //         gameState: gameStatus.gameState,
    //         globalSum: prev.globalSum
    //     }));
    // },[game])

    const handleMove = (sourceSquare: SquareNames, targetSquare: SquareNames, piece: PieceSymbol)=>{
        // Logic to handle the promotion of the pawn. (this will be handled in Attempt move case)
        // let  promotion = null;
        // // Add one more reducer with name attempt to move where you try to move if
        // if(piece === 'p'){
        //     promotion = getPromotionPieceHandler(sourceSquare, targetSquare, piece);
        // }
        // getPromotionPieceHandler(sourceSquare, targetSquare,piece);


        // Updating the state of the game based on the move.
        // handleMoveUpdate(sourceSquare, targetSquare, promotion ?? undefined);
        dispatch(attemptMove({
            from: sourceSquare,
            to: targetSquare,
        }))
    }
    
    const onDropHandler = (item: PieceInfoModel, rank: string, file: string) => {
        handleMove(item.square, `${file}${rank}` as SquareNames, activePiece?.type as PieceSymbol);
    }

    const handleClick = (file: string, rank: string) => {
        handleMove(activePiece?.square as SquareNames, `${file}${rank}` as SquareNames, activePiece?.type as PieceSymbol);
    }

    // Handle the possible moves for the selected piece.
    const activePieceHandler = (type: "set" | "reset") => (PieceInfo?: PieceInfoModel) => {
            if (type === "reset") {
            setActivePiece(null);
            return;
        }
        if(PieceInfo?.color === gameState.turn && (!isSinglePlayer || player === PieceInfo.color)){
            PieceInfo && setActivePiece((prev)=>{
                if(prev?.square === PieceInfo.square){
                    return null;
                }
                return PieceInfo;
            });
        }
    };

    const possibleMoveSetterHandler = (option: "set" | "reset")=> (square?: SquareNames) => {
        if(option === "reset"){
           dispatch(clearPossibleMoves());
            return;
        }
        if(square && (game !== null) && (gameState.turn === game.get(square)?.color)){
            // dispatch(setActivePiece(square));
        }
    };

    // Handlers for promotion dialog
    const handlePromotion = (piece: pieceTypeForPromotion) => {
        dispatch(executePromotion(piece));
    };

    const handlePromotionCancel = () => {
        dispatch(cancelPromotion());
    };


    // Handle the render board based on the player. (Memorize to save compute on each render.)
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
                                key={`${file}${rank}`}
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
                                        setPossibleMove={possibleMoveSetterHandler}
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
