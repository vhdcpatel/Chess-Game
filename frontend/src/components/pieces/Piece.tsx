import React from 'react';
import styles from './Piece.module.css';
import { getSrc, PieceColor, PieceType } from '../../utils/constants/srcMap';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  position: string;
}

const Piece: React.FC<PieceProps> = ({ type, color, position }) => {

  const piecePath = getSrc[color][type];

  return (
    <div className={styles.piece}  data-position={position}>
      <img src={piecePath}></img>
    </div>
  );
};

export default Piece;
