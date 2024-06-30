import React from 'react';
import styles from './Square.module.css';
import { charToNum } from '../../utils/charToNum';

interface SquareProps {
  rank: string;
  file: string;
}

const Square: React.FC<SquareProps> = (props) => {
  const {rank,file } = props;

  const isLight = (Number(file) + charToNum(rank)) % 2 !== 0;
  return (
    <React.Fragment>
      <div className={`${isLight ? styles.light : styles.dark} ${styles.square}`}  style={{ }}>
        {rank}{file}
      </div>
    </React.Fragment>
  );
};

export default Square;
