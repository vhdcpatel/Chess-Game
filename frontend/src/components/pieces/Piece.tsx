import React, { useEffect, useRef, useState } from 'react';
import styles from './Piece.module.css';
import { getSrc, PieceColor, PieceType } from '../../utils/constants/srcMap';
import { useDrag } from 'react-dnd';
import isFirefox from '../../utils/detectFireFox';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  position: string;
  // setPossibleMove: (PieceInfo: PieceModel) => void;
  // activePieceHandler: (type: "set" | "reset") => (PieceInfo?: PieceModel) => void;
}

const Piece: React.FC<PieceProps> = ({ type, color, position,setPossibleMove, activePieceHandler }) => {


  // For prevention of getting background on the image tag.
  useEffect(() => {
    if(!isFirefox()){    
      const dragPreviewImage = new Image();
      dragPreviewImage.src = "";
      preview(dragPreviewImage, {
        offsetX: 25,
        offsetY: 25,
      });
    }
  },[]);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'piece',
    item: ()=>{
      setPossibleMove({ type, color, position});
      activePieceHandler('set')({ type, color, position });
      return { type, color, position }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    activePieceHandler('set')({ type, color, position });
    setPossibleMove({ type, color, position});
  }
  
  const piecePath = getSrc[color][type];

  return (
    <div 
      className={`${styles.piece} ${isDragging ? styles.dragging: ''}`}
      >
      <img 
        src={piecePath}
        alt={`${color} ${type}`}
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        draggable={false}
        onClick={handleClick}
      ></img>
    </div>
  );
};

export default Piece;
