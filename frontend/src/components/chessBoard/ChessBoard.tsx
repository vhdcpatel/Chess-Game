import React, { useState } from 'react'
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

interface ChessBoardProps {
    player: 'white'| 'black';
}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const { player } = props;
    
    const FilesToRender = player === 'white' ? FILES : [...FILES].reverse();
    const RanksToRender = player === 'white' ? RANKS : [...RANKS].reverse();

    const [piecesPositions, setPiecesPosition] = useState(INITIALPOSITIONS);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

    const [selectedPiece, setSelectedPiece] = useState<PieceModel | null>(null);

    const updatePositionHandler = (prevPiecePosition: string, file: string, rank: string) => {
        setPiecesPosition((prevPositions) => {
            return prevPositions.map(p => 
                p.position === prevPiecePosition
                    ? { ...p, position: `${file}${rank}` }
                    : p
            );
        });
    }

    const handleClick = (file: string, rank: string) => {
        if(selectedPiece !== null){
            const { position } = selectedPiece;
            updatePositionHandler(position, file, rank);
            // Reset the possible moves.
            possibleMoveSetterHandler('reset');
            activePieceHandler('reset')();
        }else{
            console.log(file, rank);
        }

    };


    const handleDrop = (item: PieceModel, rank: string, file: string) => {
        // Handle the piece movement here with target and origin positions. 
        const prevPosition = item.position;

        if(possibleMoves.includes(`${file}${rank}`)){
            updatePositionHandler(prevPosition, file, rank);
            // Work on the position of this block
            possibleMoveSetterHandler('reset');
            activePieceHandler('reset')();

        }else{
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

    const activePieceHandler =(type: "set" | "reset") => (PieceInfo?: PieceModel) => {
        if(type === "set" && PieceInfo){
            setSelectedPiece(PieceInfo);
        }else{
            setSelectedPiece(null);
        }
    }
    
    const possibleUpdateHandler = (PieceInfo: PieceModel,piecesPositions: PieceModel[]) =>{
        if(possibleMoves.length !== 0){
            // Piece is already active, reset the possible moves.
            possibleMoveSetterHandler("reset");
        }else{
            const { type, color, position } = PieceInfo;
            possibleMoveSetterHandler("set", getPossibleMoves({ type, color, position }, piecesPositions));
        }
    }

    const setPossibleMovesHandler = (PieceInfo: PieceModel,)=>{
        // if piece is active then make it inactive.
        if(selectedPiece !== null){
            activePieceHandler('reset')();
        }
        possibleUpdateHandler(PieceInfo,piecesPositions);
    }

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
