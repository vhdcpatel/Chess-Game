import React from 'react';
import styles from './Square.module.css';
import { charToNum } from '../../utils/charToNum';

interface SquareProps {
  rank: string;
  file: string;
  children?: React.ReactNode;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Square: React.FC<SquareProps> = (props) => {
  const {rank,file,children, onDrop} = props;

  const isLight = (Number(file) + charToNum(rank)) % 2 !== 0;
  return (
    <React.Fragment>
      <div className={`${isLight ? styles.light : styles.dark} ${styles.square}`} 
           onDrop={onDrop}
           onDragOver={(e) => e.preventDefault()} >
        {children}
      </div>
    </React.Fragment>
  );
};

export default Square;
