import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Square from '../square/Square';
import styles from './ChessBoard.module.css';
import {   PieceInfoModel, PieceModel } from '../../utils/constants/initialPosition';
import { FILES, RANKS } from '../../utils/constants/ranksAndFiles';
import getPossibleMoves from '../../utils/getPossibleMoves';
import { Chess, Move, PieceSymbol, Square as  SquareNames} from 'chess.js';
import Piece from '../pieces/Piece';

interface ChessBoardProps {
    player: 'white' | 'black';
    initialPosition?: string;
}

const defaultStartFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const { player, initialPosition } = props;

    const FilesToRender = player === 'white' ? FILES : [...FILES].reverse();
    const RanksToRender = player === 'white' ? RANKS : [...RANKS].reverse();

    // const [piecesPositions, setPiecesPosition] = useState<PieceModel[]>(INITIALPOSITIONS);
    const [game, setGame] = useState<Chess>(new Chess(defaultStartFEN));
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    const [activePiece, setActivePiece] = useState<PieceInfoModel | null>(null)
    const [turn, setTurn] = useState<'white' | 'black'>('white');
    const [fen, setFen] = useState<string>(defaultStartFEN);

    const handleMoveUpdate = useCallback((from: SquareNames, to: SquareNames, promotion?: PieceSymbol) => {
        // Create a new chess.js instance to not mutate the current game.
        const newGame = new Chess(game.fen());

        const result = newGame.move({from, to, promotion});
        
        if (result) {
          setGame(newGame);
        }else{
            alert("Invalid Move");
        }
      }, [game]);


    const handleMove = (sourceSquare: SquareNames, targetSquare: SquareNames)=>{
        // Logic to handle the promotion of the pawn.
        let promotion: PieceSymbol = 'q'; // default promotion to queen.
        if (sourceSquare[1] === '7' && targetSquare[1] === '8' && game.get(sourceSquare)?.type === 'p') {
          promotion = (prompt('Choose promotion piece (q, r, b, n):', 'q') || 'q') as PieceSymbol;
        } else if (sourceSquare[1] === '2' && targetSquare[1] === '1' && game.get(sourceSquare)?.type === 'p') {
          promotion = (prompt('Choose promotion piece (q, r, b, n):', 'q') || 'q') as PieceSymbol;
        }
        
        // Updating the state of the game.
        handleMoveUpdate(sourceSquare, targetSquare, promotion);
    } 

    // Handle the possible moves for the selected piece.
    const activePieceHandler = (type: "set" | "reset") => (PieceInfo?: PieceInfoModel) => {
        if (type === "reset") {
            setActivePiece(null);
            return;
        }

        PieceInfo && setActivePiece(PieceInfo);
    };

    const possibleMoveSetterHandler = (option: "set" | "reset")=> (square?: SquareNames) => {
        if(option === "reset"){
            setPossibleMoves([]);
            return;
        }
        if(square){   
            const possibleMoves = game.moves({ square, verbose: true }) as Move[];
            const possibleMovesModified = possibleMoves.map(move => move.to);
            setPossibleMoves(possibleMovesModified);
        }
    };

    console.log(activePiece);
    console.log(possibleMoves);
    
    const boardPosition = player ==='white' ? game.board() : game.board().reverse();

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className={styles.mainOuterCtn}>
                {RanksToRender.map((rank,RankIndex) =>
                    <div key={rank} className={styles.ranks} >
                    {FilesToRender.map((file,FileIndex) => {
                        const piece = boardPosition[RankIndex][FileIndex];
                        return (
                            <Square
                                key={`${file}${rank}`}
                                file={file}
                                rank={String(rank)}
                                // color={squareColor}
                                onClick={(file: string, rank: string) => {}}
                                onDrop={(item: any, rank: string, file: string) => {}}
                                isPossibleMove={possibleMoves.includes(`${file}${rank}`)}
                            >
                                {piece && (
                                    <Piece
                                        type={piece.type}
                                        color={piece.color}
                                        position={piece.square}
                                        active={activePiece?.square === piece.square}
                                        // active={selectedPiece?.position === piece.position}
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
