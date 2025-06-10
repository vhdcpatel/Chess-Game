import React, { useEffect } from 'react';
import styles from './Piece.module.css';
import { getSrc, PieceColor, PieceType } from '../../utils/constants/srcMap';
import { useDrag } from 'react-dnd';
import isFirefox from '../../utils/detectFireFox';
import { Square } from 'chess.js';
import { PieceInfoModel } from '../../utils/constants/initialPosition';
import { useMediaQuery } from '@mui/material';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  position: string;
  active: boolean;
  activePieceHandler: (type: "set" | "reset") => (PieceInfo?: PieceInfoModel) => void;
  isSinglePlayer: boolean;
  player: 'w' | 'b';
}

const Piece: React.FC<PieceProps> = (props) => {
  const { type, color, position, activePieceHandler, active, isSinglePlayer, player} = props;

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
        return;
      }
      if(isSinglePlayer && player !== color){
        return;
      }
      const currSquare = { type, color, square: position };
      activePieceHandler('set')(currSquare as PieceInfoModel);
      return { type, color, square: position };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  // Always add dependency for the drag other wise it will take the old value 
  // and state management will become inconsistent.
  }), [type, color, position, active, activePieceHandler]);

  const handleClick = () => {
      if(active){
        activePieceHandler('reset')();
        return;
      }
      if(isSinglePlayer && player !== color){
        return;
      }
      const currSquare: PieceInfoModel = { type, color, square: position as Square}
      activePieceHandler('set')(currSquare);
  }
  
  const pieceSrc = getSrc[color][type];
  const isMobileScreen = useMediaQuery('(max-width: 1000px)');


  return (
    <div 
      className={`${styles.piece} ${isDragging ? styles.dragging: ''}`}
      >
      <img 
        src={pieceSrc}
        alt={`${color} ${type}`}
        ref={isMobileScreen ? null :  drag}
        style={{ opacity: isDragging ? 0.5 : 1, zIndex: 2}}
        draggable={false}
        onClick={handleClick}
      ></img>
    </div>
  );
};

export default Piece;
