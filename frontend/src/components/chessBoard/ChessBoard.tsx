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

    const [piecesPositions, setpiecesPosition] = useState(INITIALPOSITIONS);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, rank: string, file: string) => {
        event.preventDefault();
        const pieceData  = event.dataTransfer.getData('application/json');
        const piece: PieceModel = JSON.parse(pieceData);
        // Pick Position:
        console.log(piece.type, piece.color, piece.position);
        // Drop position
        console.log(rank, file);
      };

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
                                        onDrop={(event) => handleDrop(event, rank, String(file))}>
                                        {piece && 
                                            <Piece type={piece.type} color={piece.color} position={position} />
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
