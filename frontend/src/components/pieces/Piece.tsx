import React, { useEffect, useRef, useState } from 'react';
import styles from './Piece.module.css';
import { getSrc, PieceColor, PieceType } from '../../utils/constants/srcMap';
import { useDrag } from 'react-dnd';
import isFirefox from '../../utils/detectFireFox';
import { Square } from 'chess.js';
import { PieceInfoModel } from '../../utils/constants/initialPosition';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  position: string;
  active: boolean;
  setPossibleMove: (option: "set" | "reset") => (square?: Square) => void;
  activePieceHandler: (type: "set" | "reset") => (PieceInfo?: PieceInfoModel) => void;
}

const Piece: React.FC<PieceProps> = ({ type, color, position, setPossibleMove, activePieceHandler,active}) => {


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
      setPossibleMove('set')(position as Square);
      const currSquare: PieceInfoModel = { type, color, square: position as Square}
      activePieceHandler('set')(currSquare);

      return { type, color, square: position as Square}
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    if(active){
      activePieceHandler('reset')();
      setPossibleMove('reset')();
      return;
    }
    
    const currSquare: PieceInfoModel = { type, color, square: position as Square}
    activePieceHandler('set')(currSquare);
    setPossibleMove('set')(position as Square);
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
