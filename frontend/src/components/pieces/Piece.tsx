import React, { useEffect, useRef, useState } from 'react';
import styles from './Piece.module.css';
import { getSrc, PieceColor, PieceType } from '../../utils/constants/srcMap';
import { useDrag } from 'react-dnd';
import isFirefox from '../../utils/detectFireFox';
import { getPossibleMoves } from '../../utils/getPossibleMoves';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  position: string;
  piecesPositions: { type: PieceType, color: PieceColor, position: string }[];
  setPossibleMove: (state: "set" | "reset", possiblePositions?: string[]) => void;
}

const Piece: React.FC<PieceProps> = ({ type, color, position, piecesPositions,setPossibleMove }) => {

  const [possibleMovesVisible, setPossibleMovesVisible] = useState(false);

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
    item: { type, color, position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    if (possibleMovesVisible) {
      setPossibleMove("reset");
    } else {
      setPossibleMove("set", getPossibleMoves({ type, color, position }, piecesPositions));
    }
    setPossibleMovesVisible(!possibleMovesVisible);
  }
  
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
        onClick={handleClick}
      ></img>
    </div>
  );
};

export default Piece;
