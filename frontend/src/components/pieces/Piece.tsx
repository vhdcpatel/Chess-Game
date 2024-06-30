import React from 'react';
import styles from './Piece.module.css';
import { getSrc, PieceColor, PieceType } from '../../utils/constants/srcMap';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  position: string;
}

const Piece: React.FC<PieceProps> = ({ type, color, position }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // Wrapping data on the event object
    const pieceData = JSON.stringify({ type, color, position });
    event.dataTransfer.setData('application/json', pieceData);    
  };



  const piecePath = getSrc[color][type];

  return (
    <div className={styles.piece}  data-position={position}>
      <img 
        src={piecePath}
        alt={`${color} ${type}`}
        draggable
        onDragStart={handleDragStart}
      ></img>
    </div>
  );
};

export default Piece;
