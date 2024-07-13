import React, { useEffect } from 'react';
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

const Piece: React.FC<PieceProps> = (props) => {
  const { type, color, position, setPossibleMove, activePieceHandler, active} = props;

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
    item: () => {
      if (active) {
        activePieceHandler('reset')();
        setPossibleMove('reset')();
        // Instead of return update the logic for the handler based on 
        // last updated values. 
        return;
      }
      console.log('drag started.');
      const currSquare = { type, color, square: position };
      activePieceHandler('set')(currSquare as PieceInfoModel);
      setPossibleMove('set')(position as Square);
      return { type, color, square: position };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  // Always add dependency for the drag other wise it will take the old value 
  // and state management will become inconsistent.
  }), [type, color, position, active, setPossibleMove, activePieceHandler]);

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
  
  const pieceSrc = getSrc[color][type];

  return (
    <div 
      className={`${styles.piece} ${isDragging ? styles.dragging: ''}`}
      >
      <img 
        src={pieceSrc}
        alt={`${color} ${type}`}
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1, zIndex: 2}}
        draggable={false}
        onClick={handleClick}
      ></img>
    </div>
  );
};

export default Piece;
