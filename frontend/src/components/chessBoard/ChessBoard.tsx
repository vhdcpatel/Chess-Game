import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Square from '../square/Square';
import styles from './ChessBoard.module.css';
import { INITIALPOSITIONS, PieceModel } from '../../utils/constants/initialPosition';
import { FILES, RANKS } from '../../utils/constants/ranksAndFiles';
import getPossibleMoves from '../../utils/getPossibleMoves';
import { Chess } from 'chess.js';

interface ChessBoardProps {
    player: 'white' | 'black';
    initialPosition?: string;
}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const { player, initialPosition } = props;

    const FilesToRender = player === 'white' ? FILES : [...FILES].reverse();
    const RanksToRender = player === 'white' ? RANKS : [...RANKS].reverse();

    // const [piecesPositions, setPiecesPosition] = useState<PieceModel[]>(INITIALPOSITIONS);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    const [turn, setTurn] = useState<'white' | 'black'>('white');
    const [selectedPiece, setSelectedPiece] = useState<PieceModel | null>(null);
    const [removedPieces, setRemovedPieces] = useState<PieceModel[]>([]);
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

    const [game, setGame] = useState(new Chess());
    const [pgn, setPgn] = useState('');

  useEffect(() => {
    const newGame = new Chess();
    
    if (initialPosition) {
      newGame.loadPgn(initialPosition);
    }
    
    // while (!newGame.isGameOver()) {
    // //   const moves = newGame.moves();
    // //   const move = moves[Math.floor(Math.random() * moves.length)];
    // //   newGame.move(move);
    // }
    
    setPgn(newGame.pgn());
    setGame(newGame);
  }, [initialPosition]);

  console.log(game.board())


    const updatePositionHandler = (prevPiecePosition: string, file: string, rank: string) => {

        setLastMove({ from: prevPiecePosition, to: `${file}${rank}` });
    };

    const handleClick = (file: string, rank: string) => {
        if (selectedPiece !== null) {
            const { position, color } = selectedPiece;
            if (color === turn) {
                updatePositionHandler(position, file, rank);
                possibleMoveSetterHandler('reset');
                activePieceHandler('reset')();
                setTurn(turn === 'white' ? 'black' : 'white');
            } else {
                alert("Invalid Move");
            }
        } else {
            console.log(file, rank);
        }
    };

    const handleDrop = (item: PieceModel, rank: string, file: string) => {
        const prevPosition = item.position;

        if (possibleMoves.includes(`${file}${rank}`) && (item.color === turn)) {
            updatePositionHandler(prevPosition, file, rank);
            setTurn(turn === 'white' ? 'black' : 'white');
            possibleMoveSetterHandler('reset');
            activePieceHandler('reset')();
        } else {
            alert("Invalid Move");
            console.log("Move is invalid");
        }
    };

    const possibleMoveSetterHandler = (state: "set" | "reset", possiblePositions: string[] = []) => {
        if (state === "set") {
            setPossibleMoves(possiblePositions);
        } else {
            setPossibleMoves([]);
        }
    };

    const activePieceHandler = (type: "set" | "reset") => (PieceInfo?: PieceModel) => {
        if (type === "set" && PieceInfo) {
            setSelectedPiece(PieceInfo);
        } else {
            setSelectedPiece(null);
        }
    };

    const possibleUpdateHandler = (PieceInfo: PieceModel, piecesPositions: PieceModel[]) => {
        if (possibleMoves.length !== 0) {
            possibleMoveSetterHandler("reset");
        } else {
            const { type, color, position } = PieceInfo;
            possibleMoveSetterHandler("set", getPossibleMoves({ type, color, position }, piecesPositions, true));
        }
    };

    const setPossibleMovesHandler = (PieceInfo: PieceModel) => {
        if (selectedPiece !== null) {
            activePieceHandler('reset')();
        }
        possibleUpdateHandler(PieceInfo, piecesPositions);
    };

    const boardPosition = game.board();

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className={styles.chessboard}>
                {RanksToRender.map((rank,RankIndex) =>
                    FilesToRender.map((file,FileIndex) => {
                        // const piece = piecesPositions.find(p => p.position === `${file}${rank}`);
                        const piece = boardPosition[RankIndex][FileIndex];
                        return (
                            <Square
                                key={`${file}${rank}`}
                                file={file}
                                rank={String(rank)}
                                // color={squareColor}
                                onClick={handleClick}
                                onDrop={handleDrop}
                                isPossibleMove={possibleMoves.includes(`${file}${rank}`)}
                            >
                                {piece && piece.type}
                                {/* {piece && (
                                    // <Piece
                                    //     type={piece.type}
                                    //     color={piece.color}
                                    //     position={piece.position}
                                    //     // active={selectedPiece?.position === piece.position}
                                    //     // setPossibleMoves={setPossibleMovesHandler}
                                    //     activePieceHandler={activePieceHandler}
                                    // />
                                )} */}
                            </Square>
                        );
                    })
                )}
            </div>
        </DndProvider>
    );
};

export default ChessBoard;
