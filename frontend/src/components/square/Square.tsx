import React from 'react';
import styles from './Square.module.css';
import { charToNum } from '../../utils/charToNum';
import { useDrop } from 'react-dnd';

interface SquareProps {
  rank: string;
  file: string;
  children?: React.ReactNode;
  onDrop: (item: any, rank: string, file: string) => void;
  isPossibleMove: boolean;
}

const Square: React.FC<SquareProps> = (props) => {
  const {rank,file,children, onDrop,isPossibleMove} = props;

  const isLight = (Number(file) + charToNum(rank)) % 2 !== 0;

  const [{ isOver }, drop] = useDrop({
    accept: 'piece',
    drop: (item) => onDrop(item, rank, file),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  return (
    <React.Fragment>
      <div 
          ref={drop} 
          className={`${isLight ? styles.light : styles.dark} ${styles.square}`}
          // Letter give some other effects.
          style={{ backgroundColor: isOver ? 'lightgrey' : isPossibleMove ? 'pink': undefined }} 
          >
        {children}
      </div>
    </React.Fragment>
  );
};

export default Square;
