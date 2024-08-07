import React from 'react';
import styles from './Square.module.css';
import { charToNum } from '../../utils/charToNum';
import { useDrop } from 'react-dnd';
import { PieceInfoModel } from '../../utils/constants/initialPosition';

interface SquareProps {
  rank: string;
  file: string;
  children?: React.ReactNode;
  isActive: boolean;
  isPossibleMove: boolean;
  isCheckOrMate: boolean;
  onDrop: (item: PieceInfoModel, rank: string, file: string) => void;
  onClick: (file: string, rank: string) => void;
}

const Square: React.FC<SquareProps> = (props) => {
  const {rank,file,children, onDrop,isPossibleMove, onClick, isActive, isCheckOrMate} = props;

  const isLight = (Number(rank) + charToNum(file)) % 2 !== 0;


  const [{ }, drop] = useDrop({
    accept: 'piece',
    drop: (item: PieceInfoModel) => onDrop(item, rank, file),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const clickHandler = ()=>{
    if(isPossibleMove && onClick){
      onClick(file,rank);
    }
  }

  const squareClasses = `${isLight ? styles.light : styles.dark} ${styles.square} ${isPossibleMove ? styles.possibleMove : ''} ${isActive ? styles.activeSquare : ''} ${isCheckOrMate ? styles.checkOrMate : ''}`;
  
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
