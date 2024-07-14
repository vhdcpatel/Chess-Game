import React, { useState } from 'react';
import styles from '../Game.module.css';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from '@mui/material';
import { getSrc } from '../../../utils/constants/srcMap';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import { gameInfoModel } from '../Game';

interface StartGameDialogBoxProps {
  isOpen: boolean
  handleClose: (FinalGameInfo: gameInfoModel) => void
  gameInfo: gameInfoModel
}

const StartGameDialogBox: React.FC<StartGameDialogBoxProps> = (props) => {
  const {isOpen, handleClose,gameInfo } = props;
  const [gameInfoLocal, setGameInfoLocal] = useState(gameInfo);

  const handleUpdates = (type: 'mode' | 'color')=>(value: 'white' | 'black' | boolean)=>()=>{
    if(type === 'mode'){
      setGameInfoLocal({...gameInfoLocal, isMultiPlayer: value as boolean});
    }else if(type === 'color'){
      setGameInfoLocal({...gameInfoLocal, player: value as 'white' | 'black'});
    }
  }
  

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
            <div className={styles.outerCtn}>
              <h3 className={styles.titleText}>Please select mode to play.</h3>
              <div className={styles.innerCtn}>
                <Button onClick={handleUpdates('mode')(false)}  variant={!(gameInfoLocal.isMultiPlayer) ? 'contained' : 'outlined'} startIcon={<ComputerIcon/>}>
                  Single Player
                </Button>
                <Button onClick={handleUpdates('mode')(true)} variant={(gameInfoLocal.isMultiPlayer) ? 'contained' : 'outlined'} startIcon={<PersonIcon/>}>
                  Multi Player
                </Button>
              </div>
            </div>
            <div className={styles.outerCtn}>
              <h3 className={styles.titleText}>
                Please select side to play.
              </h3>
              <div className={styles.innerCtn}>
              <Button onClick={handleUpdates('color')('white')}  variant={gameInfoLocal.player === "white" ? 'contained' : 'outlined'} startIcon={<img className={styles.icons} src={getSrc['w']['k']}/>}>
                  White
                </Button>
                <Button onClick={handleUpdates('color')('black')} variant={gameInfoLocal.player === "black" ? 'contained' : 'outlined'} startIcon={<img className={styles.icons}  src={getSrc['b']['k']}/>}>
                  Black
                </Button>
              </div>
            </div>
            <div className={`${styles.outerCtn} ${styles.actionBox}`}>
              <div className={styles.actionBoxInner}>
                <Button variant="contained" onClick={()=>{handleClose(gameInfoLocal)}}>
                  Start Game
                </Button>
              </div>
            </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default StartGameDialogBox;