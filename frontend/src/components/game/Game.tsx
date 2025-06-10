import React, { useEffect, useState } from 'react';
import ChessBoard from '../chessBoard/ChessBoard';
import { DEFAULT_POSITION } from '../../utils/constants/initialPosition';
import styles from './Game.module.css';
import StartGameDialogBox from './startGameDialogBox/StartGameDialogBox';

export interface gameInfoModel {
  player: 'w' | 'b';
  initialPosition?: string;
  isSinglePlayer: boolean;

}

const Game: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [gameInfo, setGameInfo] = useState<gameInfoModel>({
    player: 'w',
    initialPosition: DEFAULT_POSITION,
    isSinglePlayer: false
  });

  useEffect(()=>{
    setDialogOpen(true);
    // Should Load board with dummy data. better UX.
  },[]);

  const handleCloseDialog = (FinalGameInfo: gameInfoModel)=>{
    setDialogOpen(false);
    setGameInfo(FinalGameInfo);
  };

  return (
    <React.Fragment>
      <StartGameDialogBox
          isOpen={dialogOpen}
          handleClose={handleCloseDialog}
          gameInfo={gameInfo}
      />
      <div className={styles.mainOuterCtn}>
        <ChessBoard />
      </div>
    </React.Fragment>
  );
};

export default Game;