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

interface ChessBoardProps {
    player: 'white'| 'black';
}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const { player } = props;
    
    const FilesToRender = player === 'white' ? FILES : [...FILES].reverse();
    const RanksToRender = player === 'white' ? RANKS : [...RANKS].reverse();

    const [piecesPositions, setPiecesPosition] = useState(INITIALPOSITIONS);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

    const handleDrop = (item: PieceModel, rank: string, file: string) => {
        
        // Handle the piece movement here with target and origin positions.
        console.log(item.type, item.color, item.position);
        console.log(rank, file);
        
        setPiecesPosition((prevPositions) => {
            return prevPositions.map(p => 
                p.position === item.position
                    ? { ...p, position: `${rank}${file}` }
                    : p
            );
        });
    };

    const possibleMoveSetterHandler = (state: "set" | "reset")=> (possiblePositons:string[] = [])=>{
        // Handle the possible moves rendering here
        console.log(possibleMoves);
    }

    return (
        <React.Fragment>
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <div className={styles.mainOuterCtn}>
                    {FilesToRender.map((file) => {
                        return (
                            <div key={file} className={styles.ranks} >
                                {RanksToRender.map((rank) => {
                                    // Handle the pieces rendering here
                                    const position = `${rank}${file}`;
                                    const piece = piecesPositions.find(p => p.position === position);
                                    return (
                                    <Square 
                                        key={(rank+file)} 
                                        rank={rank} 
                                        file={String(file)} 
                                        onDrop={handleDrop}>
                                        {piece && 
                                            <Piece type={piece.type} color={piece.color} position={position} setPossibleMove={possibleMoveSetterHandler} />
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
