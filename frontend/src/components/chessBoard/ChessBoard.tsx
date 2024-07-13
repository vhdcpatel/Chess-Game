import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Square from '../square/Square';
import styles from './chessBoard.module.css';
import {   GameStatus, initialStatus, PieceInfoModel } from '../../utils/constants/initialPosition';
import { FILES, RANKS } from '../../utils/constants/ranksAndFiles';
import { Chess, Color, Move, PieceSymbol, Square as  SquareNames} from 'chess.js';
import Piece from '../pieces/Piece';
import { getPromotionPieceHandler } from '../../utils/constants/handleMoves';
import getGameStatus from '../../utils/getGameStatus';

interface ChessBoardProps {
    player: 'white' | 'black';
    initialPosition?: string;
    isMultiPlayer: boolean;
}

const defaultStartFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const { player, initialPosition, isMultiPlayer } = props;

    // Handle the render board based on the player.
    const FilesToRender = player === 'white' ? FILES : [...FILES].reverse();
    const RanksToRender = player === 'white' ? RANKS : [...RANKS].reverse();

    const [game, setGame] = useState<Chess>(new Chess(defaultStartFEN));
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    const [activePiece, setActivePiece] = useState<PieceInfoModel | null>(null);
    const [gameState, setGameState] = useState<GameStatus>(initialStatus);
    
    // future implementation
    // Handle check, stalemate, checkmate or draw state. for the game. 
    const [history, setHistory] = useState<Move[]>([]); 
    // [from, to, piece, captured, promotion, flags, san, lan, before(fen), after*(fen)] array of all this things.
   
    useEffect(()=>{
        let gameStatus = gameState.gameState;
        // Handling the checkMate, staleMate and Draw state currently.
        if(gameStatus === 'CheckMate'){
            alert(`CheckMate ${gameState.turn === 'w' ? 'black':'white'} won the game`);
            // setGame(new Chess(defaultStartFEN));
        }else if(gameStatus === 'Draw'){
            alert(`Game Draw`);
        }else if(gameStatus === 'StaleMate'){
            alert(`StaleMate Positions for the ${gameState.turn === 'b' ? 'Black':'White'} player.`);
        }
    },[gameState]);

    // Update the game state based on the game after move completes.
    useEffect(()=>{
        const gameStatus = getGameStatus(game);
        setGameState(gameStatus);
    },[game])


    const handleMoveUpdate = useCallback((from: SquareNames, to: SquareNames, promotion?: PieceSymbol) => {
        // Create a new chess.js instance to not mutate the current game.
        const newGame = new Chess(game.fen());

        const result = newGame.move({from, to, promotion});
        console.log(result);
        
        if (result) {
            // If valid move then update the game state.
            setGame(newGame);
            // It was too quick even before moving the piece.
            // let gameStatus = getGameStatus(newGame);
            // setGameState(gameStatus);
            setHistory([...history, result]);
            possibleMoveSetterHandler('reset')();
            activePieceHandler('reset')();
        }else{
            alert("Invalid Move");
        }
      }, [game]);



    const handleMove = (sourceSquare: SquareNames, targetSquare: SquareNames, piece: PieceSymbol)=>{
        // Logic to handle the promotion of the pawn.
        let  promotion = null;
        if(piece === 'p'){
            promotion = getPromotionPieceHandler(sourceSquare, targetSquare, piece);
        } 
        getPromotionPieceHandler(sourceSquare, targetSquare,piece);
        // Updating the state of the game based on the move.
        handleMoveUpdate(sourceSquare, targetSquare, promotion ?? undefined);
    }
    
    const onDropHandler = (item: PieceInfoModel, rank: string, file: string) => {
        // Handle the same move
        // if(item.square === `${file}${rank}`){
        //     alert("Invalid Move");
        //     return;
        // }
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
        if(PieceInfo?.color === gameState.turn){
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
            setPossibleMoves([]);
            return;
        }
        if(square){
            const possibleMoves = game.moves({square, verbose: true});
            const possibleMovesModified = possibleMoves.map(move => move.to);
            setPossibleMoves(possibleMovesModified);
        }
    };

    console.log(activePiece);
    console.log(possibleMoves);
    console.log(history);
    console.log(gameState);
    
    const boardPosition = player ==='white' ? game.board() : game.board().reverse();

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className={styles.mainOuterCtn}>
                {RanksToRender.map((rank,RankIndex) =>
                    <div key={rank} className={styles.ranks} >
                    {FilesToRender.map((file,FileIndex) => {
                        const piece = boardPosition[RankIndex][FileIndex];
                        const isCheckOrMate = (gameState.gameState === "Check" || gameState.gameState==="CheckMate") && gameState.turn === piece?.color && piece?.type === 'k';
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
    );
};

export default ChessBoard;
