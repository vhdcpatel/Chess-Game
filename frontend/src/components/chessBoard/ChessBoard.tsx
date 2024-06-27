import React from 'react'
import Square from '../square/Square';
import styles from './chessBoard.module.css';

const RANKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const FILES = [1, 2, 3, 4, 5, 6, 7, 8].reverse();

interface ChessBoardProps {
    player: 'white'| 'black';
}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const { player } = props;
    
    const FilesToRender = player === 'white' ? FILES : [...FILES].reverse();
    const RanksToRender = player === 'white' ? RANKS : [...RANKS].reverse();

    return (
        <React.Fragment>
            <div className={styles.mainOuterCtn}>
                {FilesToRender.map((file) => {
                    return (
                        <div key={file} style={{display: 'flex', flexDirection: 'row'}}>
                            {RanksToRender.map((rank) => {
                                return (
                                  <Square key={(rank+file)} rank={rank} file={String(file)}/>
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
