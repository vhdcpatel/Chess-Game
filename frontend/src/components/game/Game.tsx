import React, { useEffect, useState } from 'react';
import ChessBoard from '../chessBoard/ChessBoard';
import { DEFAULT_POSITION } from '../../utils/constants/initialPosition';
import styles from './Game.module.css';
import StartGameDialogBox from './startGameDialogBox/StartGameDialogBox';

export interface gameInfoModel {
  player: 'white' | 'black';
  initialPosition?: string;
  isMultiPlayer: boolean;

}

const Game: React.FC = (props) => {
  const {} = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [gameInfo, setGameInfo] = useState<gameInfoModel>({
    player: 'white',
    initialPosition: DEFAULT_POSITION,
    isMultiPlayer: true
  });

  useEffect(()=>{
    setDialogOpen(true);
  },[]);

  const handleCloseDialog = (FinalGameInfo: gameInfoModel)=>{
    setDialogOpen(false);
    setGameInfo(FinalGameInfo);
  };

  const handleGameInfoUpdate = ()=>{

  };



  return (
    <React.Fragment>
      <StartGameDialogBox isOpen={dialogOpen} handleClose={handleCloseDialog} gameInfo={gameInfo} />
      <div className={styles.mainOuterCtn}>
        <ChessBoard player={gameInfo.player} initialPosition={DEFAULT_POSITION} isMultiPlayer={true} />
      </div>
    </React.Fragment>
  );
};

export default Game;