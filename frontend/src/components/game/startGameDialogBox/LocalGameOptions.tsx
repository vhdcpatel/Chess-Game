import React from 'react';
import styles from '../Game.module.css';
import { Button } from '@mui/material';
import { getSrc } from '../../../utils/constants/srcMap';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import { gameInfoModel } from '../Game';

interface LocalGameOptionsProps {
  gameInfoLocal: gameInfoModel;
  setGameInfoLocal: React.Dispatch<React.SetStateAction<gameInfoModel>>
  handleStartGame: () => void;
}

const LocalGameOptions: React.FC<LocalGameOptionsProps> = (props) => {
  const { gameInfoLocal, setGameInfoLocal, handleStartGame} = props;


  const handleUpdates = (type: 'mode' | 'color')=>(value: 'w' | 'b' | boolean)=>()=>{
    if(type === 'mode'){
      setGameInfoLocal((gameInfoLocal)=>({...gameInfoLocal, isSinglePlayer: value as boolean}));
    }else if(type === 'color'){
      setGameInfoLocal((gameInfoLocal)=>({...gameInfoLocal, player: value as 'w' | 'b'}));
    }
  }

  return (
    <React.Fragment>
      <div className={styles.outerCtn}>
        <h3 className={styles.titleText}>Please select mode to play.</h3>
        <div className={styles.innerCtn}>
          <Button onClick={handleUpdates('mode')(false)} variant={!(gameInfoLocal.isSinglePlayer) ? 'contained' : 'outlined'} startIcon={<PersonIcon />}>
            Multi Player
          </Button>
          <Button onClick={handleUpdates('mode')(true)} variant={(gameInfoLocal.isSinglePlayer) ? 'contained' : 'outlined'} startIcon={<ComputerIcon />}>
            Single Player
          </Button>
        </div>
      </div>
      <div className={styles.outerCtn}>
        <h3 className={styles.titleText}>
          Please select side to play.
        </h3>
        <div className={styles.innerCtn}>
          <Button onClick={handleUpdates('color')('w')} variant={gameInfoLocal.player === "w" ? 'contained' : 'outlined'} startIcon={<img className={styles.icons} src={getSrc['w']['k']} />}>
            White
          </Button>
          <Button onClick={handleUpdates('color')('b')} variant={gameInfoLocal.player === "b" ? 'contained' : 'outlined'} startIcon={<img className={styles.icons} src={getSrc['b']['k']} />}>
            Black
          </Button>
        </div>
      </div>
      <div className={`${styles.outerCtn} ${styles.actionBox}`}>
        <div className={styles.actionBoxInner}>
          <Button variant="contained" onClick={handleStartGame}>
            Start Game
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LocalGameOptions;
