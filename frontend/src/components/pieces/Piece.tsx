import React, { useEffect, useRef } from 'react';
import styles from './Piece.module.css';
import { getSrc, PieceColor, PieceType } from '../../utils/constants/srcMap';
import { useDrag } from 'react-dnd';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  position: string;
}

const Piece: React.FC<PieceProps> = ({ type, color, position }) => {

  // For prevention of getting background on the image tag.
  useEffect(() => {
    const dragPreviewImage = new Image();
    dragPreviewImage.src = "";
    preview(dragPreviewImage, {
      offsetX: 25,
      offsetY: 25,
    });
  },[]);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'piece',
    item: { type, color, position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  
  const piecePath = getSrc[color][type];

  return (
    <div 
      className={styles.piece}  
    >
      <img 
        src={piecePath}
        alt={`${color} ${type}`}
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        draggable={false}
      ></img>
    </div>
  );
};

export default Piece;
