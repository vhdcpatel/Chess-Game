import React from 'react';
import ChessBoard from '../chessBoard/ChessBoard';
import { DEFAULT_POSITION } from '../../utils/constants/initialPosition';
import styles from './Game.module.css';


const Game: React.FC = (props) => {
  const {} = props;

  return (
    <React.Fragment>
      <div className={styles.mainOuterCtn}>
        <ChessBoard player='white' initialPosition={DEFAULT_POSITION} isMultiPlayer={true} />
      </div>
    </React.Fragment>
  );
};

export default Game;