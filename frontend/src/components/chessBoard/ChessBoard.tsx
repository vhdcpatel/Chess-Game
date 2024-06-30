import React, { useState } from 'react'
import Square from '../square/Square';
import Piece from '../pieces/Piece';
import styles from './chessBoard.module.css';
import { INITIALPOSITIONS } from '../../utils/constants/initialPosition';
import { FILES, RANKS } from '../../utils/constants/ranksAndFiles';

interface ChessBoardProps {
    player: 'white'| 'black';
}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const { player } = props;
    
    const FilesToRender = player === 'white' ? FILES : [...FILES].reverse();
    const RanksToRender = player === 'white' ? RANKS : [...RANKS].reverse();

    const [piecesPositions, setpiecesPosition] = useState(INITIALPOSITIONS);

    // const handleDrop = (item: any, newPosition: string) => {
    //     setPieces((prevPieces) =>
    //         prevPieces.map((p) =>
    //             p.position === item.position ? { ...p, position: newPosition } : p
    //         )
    //     );
    // };

    return (
        <React.Fragment>
            <div className={styles.mainOuterCtn}>
                {FilesToRender.map((file) => {
                    return (
                        <div key={file} className={styles.ranks} >
                            {RanksToRender.map((rank) => {
                                // Handle the pieces rendering here
                                const position = `${rank}${file}`;
                                const piece = piecesPositions.find(p => p.position === position);

                                return (
                                  <Square key={(rank+file)} rank={rank} file={String(file)}>
                                    {piece && <Piece type={piece.type} color={piece.color} position={position} />}
                                  </Square>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </React.Fragment>
    );
};

export default ChessBoard;
