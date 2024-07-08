    import React, { useEffect, useState } from 'react'
    import { DndProvider } from 'react-dnd';
    import { HTML5Backend } from 'react-dnd-html5-backend';
    import { TouchBackend } from 'react-dnd-touch-backend';
    import { isMobile } from 'react-device-detect';
    import Square from '../square/Square';
    import styles from './chessBoard.module.css';
    import { INITIALPOSITIONS, PieceModel } from '../../utils/constants/initialPosition';
    import { FILES, RANKS } from '../../utils/constants/ranksAndFiles';
    import Piece from '../pieces/Piece';
    import { getPossibleMoves } from '../../utils/getPossibleMoves';
    import { PieceType, PieceTypes } from '../../utils/constants/srcMap';

    interface ChessBoardProps {
        player: 'white'| 'black';
    }

    const ChessBoard: React.FC<ChessBoardProps> = (props) => {
        const { player } = props;
        
        const FilesToRender = player === 'white' ? FILES : [...FILES].reverse();
        const RanksToRender = player === 'white' ? RANKS : [...RANKS].reverse();

        const [piecesPositions, setPiecesPosition] = useState(INITIALPOSITIONS);
        const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
        const [turn, setTurn] = useState<'white' | 'black'>('white');
        const [selectedPiece, setSelectedPiece] = useState<PieceModel | null>(null);
        const [removedPieces, setRemovedPieces] = useState<PieceModel[]>([]);
        const [lastMove, setLastMove] = useState<{ from: string, to: string } | null>(null);

        useEffect(() => {
            // Check for check or checkmate
            if (isInCheck(turn)) {
            if (isCheckmate(turn)) {
                alert(`${turn} is in checkmate!`);
            } else {
                alert(`${turn} is in check!`);
            }
            } else if (isStalemate(turn)) {
            alert(`Stalemate!`);
            }
        }, [turn]);
        
        const updatePositionHandler = (prevPiecePosition: string, file: string, rank: string) => {
            setPiecesPosition((prevPositions) => {
                const destination = `${file}${rank}`;
                const capturedPiece = prevPositions.find(p => p.position === destination);
                const updatedPositions = prevPositions.filter(p => p.position !== destination);
                const newPositions = updatedPositions.map(p =>
                    p.position === prevPiecePosition
                        ? { ...p, position: destination }
                        : p
                );

                if (capturedPiece) {
                    setRemovedPieces(prev => [...prev, capturedPiece]);
                }

                // Handle En Passant
                if (selectedPiece?.type === 'pawn' && prevPiecePosition[0] !== file && !capturedPiece) {
                    const enPassantPosition = `${file}${prevPiecePosition[1]}`;
                    const enPassantPiece = prevPositions.find(p => p.position === enPassantPosition && p.type === 'pawn' && p.color !== selectedPiece.color);
                    if (enPassantPiece) {
                        setRemovedPieces(prev => [...prev, enPassantPiece]);
                        return updatedPositions.filter(p => p.position !== enPassantPosition).map(p =>
                            p.position === prevPiecePosition
                                ? { ...p, position: destination }
                                : p
                        );
                    }
                }

                // Handle Castling
                if (selectedPiece?.type === 'king' && Math.abs(prevPiecePosition[0].charCodeAt(0) - file.charCodeAt(0)) === 2) {
                    const rookFile = file < prevPiecePosition[0] ? 'a' : 'h';
                    const newRookFile = file < prevPiecePosition[0] ? 'd' : 'f';
                    const rookPosition = `${rookFile}${rank}`;
                    const castlingPath = file < prevPiecePosition[0] 
                    ? [prevPiecePosition[0], 'c', 'd']
                    : [prevPiecePosition[0], 'f', 'g'];
                    
                    if (castlingPath.some(pathFile => isSquareAttacked(`${pathFile}${rank}`, selectedPiece.color))) {
                    alert("Cannot castle through check");
                    return prevPositions;
                    }
                    
                    return updatedPositions.map(p =>
                    p.position === prevPiecePosition
                        ? { ...p, position: destination }
                        : p.position === rookPosition
                        ? { ...p, position: `${newRookFile}${rank}` }
                        : p
                    );
                }
            

                // Handle Pawn Promotion
                if (selectedPiece?.type === PieceTypes.Pawn && (rank === '8' || rank === '1')) {
                    const promotedPieceType = window.prompt('Choose piece type for promotion (queen, rook, bishop, knight)', 'queen') as PieceType;
                    return newPositions.map(p =>
                        p.position === destination
                            ? { ...p, type: promotedPieceType || PieceTypes.Queen }
                            : p
                    );
                }
                return newPositions;
            });

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
        
        const isInCheck = (color: 'white' | 'black') => {
            const king = piecesPositions.find(p => p.type === 'king' && p.color === color);
            if (!king) return false;

            return piecesPositions
                .filter(p => p.color !== color)
                .some(p => getPossibleMoves(p, piecesPositions).includes(king.position));
        };
        
        const isCheckmate = (color: 'white' | 'black') => {
            const king = piecesPositions.find(p => p.type === 'king' && p.color === color);
            if (!king) return false;
        
            if (!isInCheck(color)) return false;
        
            return piecesPositions
            .filter(p => p.color === color)
            .every(p => {
                return getPossibleMoves(p, piecesPositions, true).every(move => {
                const originalPosition = p.position;
                const targetPosition = piecesPositions.find(pos => pos.position === move);
                const updatedPositions = piecesPositions.map(pos =>
                    pos.position === originalPosition ? { ...pos, position: move } : pos
                ).filter(pos => pos.position !== move);
                
                const isInCheckAfterMove = updatedPositions
                    .filter(pos => pos.color !== color)
                    .some(pos => getPossibleMoves(pos, updatedPositions, false).includes(king.position));
                    
                p.position = originalPosition; // Restore original position
                if (targetPosition) piecesPositions.push(targetPosition); // Restore captured piece
                
                return !isInCheckAfterMove;
                });
            });
        };
        
        const isStalemate = (color: 'white' | 'black') => {
        if (isInCheck(color)) return false;

            return piecesPositions
                .filter(p => p.color === color)
                .every(p => getPossibleMoves(p, piecesPositions).length === 0);
        };

        const isSquareAttacked = (square: string, color: 'white' | 'black') => {
            return piecesPositions
            .filter(p => p.color !== color)
            .some(p => getPossibleMoves(p, piecesPositions).includes(square));
        };
        

        return (
            <React.Fragment>
                <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                    <div className={styles.mainOuterCtn}>
                        {RanksToRender.map((rank) => {
                            return (
                                <div key={rank} className={styles.ranks} >
                                    {FilesToRender.map((file) => {
                                        // Handle the pieces rendering here
                                        const position = `${file}${rank}`;
                                        const piece = piecesPositions.find(p => p.position === position);
                                        return (
                                        <Square 
                                            key={(file+rank)} 
                                            rank={String(rank)} 
                                            file={file} 
                                            onDrop={handleDrop}
                                            isPossibleMove={possibleMoves.includes(position)}
                                            onClick={handleClick}
                                            >
                                            {piece && 
                                                <Piece 
                                                    type={piece.type} 
                                                    color={piece.color} 
                                                    position={position} 
                                                    setPossibleMove={setPossibleMovesHandler}
                                                    activePieceHandler={activePieceHandler}
                                                    />
                                            }
                                        </Square>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </DndProvider>
            </React.Fragment>
        ); 
    };

    export default ChessBoard;
