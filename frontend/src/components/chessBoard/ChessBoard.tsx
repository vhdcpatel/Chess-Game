import React from 'react'
import Square from '../square/Square';

const RANKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const FILES = [1, 2, 3, 4, 5, 6, 7, 8];

interface ChessBoardProps {
    
}

const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const {} = props;
    

    return (
        <React.Fragment>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                {RANKS.reverse().map((rank) => {
                    return (
                        <div key={rank} style={{display: 'flex', flexDirection: 'row'}}>
                            {FILES.map((file) => {
                              console.log(rank, file);
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
