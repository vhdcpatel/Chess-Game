import React, { useEffect, useState } from 'react';
import ChessBoard from '../chessBoard/ChessBoard';
import { DEFAULT_POSITION } from '../../utils/constants/initialPosition';
import styles from './Game.module.css';
import StartGameDialogBox from './startGameDialogBox/StartGameDialogBox';
import { initGame, startGame } from "../../features/chessGame/chessSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

export interface gameInfoModel {
  player: 'w' | 'b';
  initialPosition?: string;
  isSinglePlayer: boolean;
  elo: number;
}

const Game: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const gameInfo:gameInfoModel = {
    player: 'w',
    initialPosition: DEFAULT_POSITION,
    isSinglePlayer: false,
    elo: 1200,
  };

  const dispatch = useAppDispatch();

  useEffect(()=>{
    dispatch(initGame());
    setDialogOpen(true);
    // Should Load board with dummy data. better UX.
  },[]);

  const handleCloseDialog = (FinalGameInfo: gameInfoModel)=>{
    setDialogOpen(false);
    dispatch(startGame({isSinglePlayer: FinalGameInfo.isSinglePlayer, player:  FinalGameInfo.player, elo: FinalGameInfo.elo}));
    // setGameInfo(FinalGameInfo);
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