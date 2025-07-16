import React from 'react';
import styles from './Square.module.css';
import { charToNum } from '../../utils/charToNum';
import { useDrop } from 'react-dnd';
import { PieceInfoModel } from '../../utils/constants/initialPosition';
import FileLabel from '../chessLabels/FileLabel';
import { getBorderRadius } from '../../utils/getBorderRadius';
import RankLabel from '../chessLabels/RankLabel';

interface SquareProps {
  rank: string;
  file: string;
  children?: React.ReactNode;
  isActive: boolean;
  isPossibleMove: boolean;
  isCheckOrMate: boolean;
  onDrop: (item: PieceInfoModel, rank: string, file: string) => void;
  onClick: (file: string, rank: string) => void;
  rankIndex: number;
  fileIndex: number;
}

const Square: React.FC<SquareProps> = (props) => {
  const {
    rank,
    file,
    children,
    onDrop,
    isPossibleMove,
    onClick,
    isActive,
    isCheckOrMate,
    rankIndex,
    fileIndex,
  } = props;

  const isLight = (Number(rank) + charToNum(file)) % 2 !== 0;

  // Fix: use a ref and pass it to drop
  const divRef = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'piece',
    drop: (item: PieceInfoModel) => onDrop(item, rank, file),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  React.useEffect(() => {
    if (divRef.current) {
      drop(divRef.current);
    }
  }, [drop]);

  const clickHandler = ()=>{
    if(isPossibleMove && onClick){
      onClick(file,rank);
    }
  }

  const squareClasses = `
    ${isLight ? styles.light : styles.dark} 
    ${styles.square} ${isPossibleMove ? styles.possibleMove : ''} 
    ${isActive ? styles.activeSquare : ''} 
    ${isCheckOrMate ? styles.checkOrMate : ''}
    ${getBorderRadius(rankIndex, fileIndex)}
  `;
  
  return (
    <React.Fragment>
      <div
          ref={divRef}
          data-testid="square"
          className={squareClasses}
          style={{cursor: isPossibleMove ? 'pointer' : 'default'}}
          onClick={clickHandler}
          >
        {/* {rank}{file} */}
        {fileIndex === 0 && <RankLabel rank={rank} rankIndex={rankIndex} />}
        {rankIndex === 7 && <FileLabel file={file} fileIndex={fileIndex} />}
        {children}
      </div>
    </React.Fragment>
  );
};

export default Square;
