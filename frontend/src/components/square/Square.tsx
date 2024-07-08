import React from 'react';
import styles from './Square.module.css';
import { charToNum } from '../../utils/charToNum';
import { useDrop } from 'react-dnd';

interface SquareProps {
  rank: string;
  file: string;
  children?: React.ReactNode;
  onDrop: (item: any, rank: string, file: string) => void;
  onClick: (file: string, rank: string) => void;
  isPossibleMove: boolean;
}

const Square: React.FC<SquareProps> = (props) => {
  const {rank,file,children, onDrop,isPossibleMove, onClick} = props;

  const isLight = (Number(rank) + charToNum(file)) % 2 !== 0;


  const [{ isOver }, drop] = useDrop({
    accept: 'piece',
    drop: (item) => onDrop(item, rank, file),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const clickHandler = ()=>{
    if(isPossibleMove && onClick){
      onClick(file,rank);
    }
  }

  const squareClasses = `${isLight ? styles.light : styles.dark} ${styles.square} ${isPossibleMove ? styles.possibleMove : ''}`;
  
  return (
    <React.Fragment>
      <div 
          ref={drop} 
          className={squareClasses}
          style={{cursor: isPossibleMove ? 'pointer' : 'default'}}
          onClick={clickHandler}
          >
        {/* {rank}{file} */}
        {children}
      </div>
    </React.Fragment>
  );
};

export default Square;
