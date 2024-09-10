import React, { useState } from 'react';
import styles from '../Game.module.css';
import { Button, TextField, Typography } from '@mui/material';
import { gameInfoModel } from '../Game';
import { joinGame, startGame } from '../../../services/apis/auth';


interface OnlineGameOptionsProps {
  handleStartGame: () => void;
  setGameInfoLocal: React.Dispatch<React.SetStateAction<gameInfoModel>>
}

const OnlineGameOptions: React.FC<OnlineGameOptionsProps> = (props) => {
  const {handleStartGame, setGameInfoLocal} = props;

  const [gameCode, setGameCode] = useState('');
  const [newGameCode, setNewGameCode] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameCode(event.target.value);
  };

  const handleJoinGameBtn =async () => {
    console.log(`Joining game with code: ${gameCode}`);
    await joinGame({gameCode: gameCode});
    setGameInfoLocal((gameInfoLocal)=>({...gameInfoLocal,player:'w', isOnline: true}));

    // Only Start game after getting signal from socket.
    // handleStartGame();
  };

  const handleStartBtn =async () => {
    const generatedCode = 'NEW123';
    const res:any = await startGame();
    console.log(res);
    // get the game info from the server.
    setNewGameCode(generatedCode);
    console.log(`Starting game online with code: ${generatedCode}`);
    setGameInfoLocal((gameInfoLocal)=>({...gameInfoLocal,player:'b', isOnline: true}));
    // handleStartGame();
  };

  return (
    <React.Fragment>
      <div className={`${styles.outerCtn} ${styles.actionBox}`}>
        <div className={styles.actionBoxInner}>
          <Typography variant="h6" className={styles.instructionText}>
            {newGameCode ? 
              `Your new game code is: ${newGameCode}` : 
              'Enter a code to join an existing game or start a new game.'
            }
          </Typography>
          <TextField
            label="Enter Game Code"
            variant="outlined"
            value={gameCode}
            onChange={handleInputChange}
            className={styles.input}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinGameBtn}
            className={styles.button}
          >
            Join with Code
          </Button>
          <Button
            variant="contained"
            onClick={handleStartBtn}
            className={styles.button}
          >
            Start New Game Online
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OnlineGameOptions;
