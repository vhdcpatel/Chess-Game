import React, { useState } from 'react';
import styles from '../Game.module.css';
import { Button, Dialog, DialogTitle, Divider } from '@mui/material';

import { gameInfoModel } from '../Game';
import LocalGameOptions from './LocalGameOptions';
import OnlineGameOptions from './OnlineGameOptions';

interface StartGameDialogBoxProps {
  isOpen: boolean
  handleClose: (FinalGameInfo: gameInfoModel) => void
  gameInfo: gameInfoModel
}

const StartGameDialogBox: React.FC<StartGameDialogBoxProps> = (props) => {
  const {isOpen, handleClose ,gameInfo } = props;

  const [gameInfoLocal, setGameInfoLocal] = useState(gameInfo);
  const [gameMode, setGameMode] = useState<'local' | 'online'>('online');

  const handleStartGame = ()=>{
    handleClose(gameInfoLocal);
  }

  // const handleStartGame =async ()=>{
  //   const response = await startGame();
  //   console.log(response);
  // } 

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={() => { }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='xl'
      >
        <DialogTitle id="alert-dialog-title" className={styles.headerText}>
          {"Please Select the Game Mode"}
        </DialogTitle>
        <Divider/>
        <div className={styles.dialogCtn}>
          <div className={styles.modeSelector}>
            <Button 
              onClick={() => setGameMode('local')}
              variant={gameMode === 'local' ? 'contained' : 'outlined'}
            >
              Local
            </Button>
            <Button 
              onClick={() => setGameMode('online')}
              variant={gameMode === 'online' ? 'contained' : 'outlined'}
            >
              Online
            </Button>
          </div>
          {gameMode === 'local' ? (
            <LocalGameOptions
              gameInfoLocal={gameInfoLocal}
              setGameInfoLocal={setGameInfoLocal}
              handleStartGame={handleStartGame}
            />
          ) : (
            <OnlineGameOptions
              handleStartGame={handleStartGame}
              setGameInfoLocal={setGameInfoLocal}
            />
          )}  
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default StartGameDialogBox;