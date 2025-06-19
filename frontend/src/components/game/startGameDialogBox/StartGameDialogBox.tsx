import React, { useState } from 'react';
import styles from '../Game.module.css';
import { Button, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import { getSrc } from '../../../utils/constants/srcMap';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import { gameInfoModel } from '../Game';
import GenericDialog from "../../dialogBox/GenericDialog";
import MenuItem from "@mui/material/MenuItem";


interface StartGameDialogBoxProps {
  isOpen: boolean;
  handleClose: (FinalGameInfo: gameInfoModel) => void;
  gameInfo: gameInfoModel;
}

const StartGameDialogBox: React.FC<StartGameDialogBoxProps> = (props) => {
  const { isOpen, handleClose, gameInfo } = props;
  const [gameInfoLocal, setGameInfoLocal] = useState(gameInfo);

  const handleUpdates =
      (type: 'mode' | 'color') =>
          (value: 'w' | 'b' | boolean) =>
              () => {
                if (type === 'mode') {
                  setGameInfoLocal({ ...gameInfoLocal, isSinglePlayer: value as boolean });
                } else if (type === 'color' && typeof value === 'string') {
                  setGameInfoLocal({ ...gameInfoLocal, player: value });
                }
              };

  const handleEloChange = (e: SelectChangeEvent<number>) => {
      setGameInfoLocal({...gameInfoLocal, elo: e.target.value as number})
  }

  const dialogContent = (
      <>
        <div className={styles.outerCtn}>
          <h3 className={styles.titleText}>Please select mode to play.</h3>
          <div className={styles.innerCtn}>
            <Button
                onClick={handleUpdates('mode')(false)}
                variant={!gameInfoLocal.isSinglePlayer ? 'contained' : 'outlined'}
                startIcon={<PersonIcon />}
            >
              Multi Player
            </Button>
            <Button
                onClick={handleUpdates('mode')(true)}
                variant={gameInfoLocal.isSinglePlayer ? 'contained' : 'outlined'}
                startIcon={<ComputerIcon />}
            >
              Single Player
            </Button>
          </div>
        </div>
       <div>
       {/* Add DropDown For Elo and Add option of 800 to 2000 with gap 0f 100 */}
           <h3 className={styles.titleText}>Please select ELO rating.</h3>
           <div className={styles.innerCtn}>
               <FormControl className={styles.eloDropdown} variant="outlined">
                   <InputLabel id="elo-select-label">ELO Rating</InputLabel>
                   <Select
                       labelId="elo-select-label"
                       id="elo-select"
                       value={gameInfoLocal.elo || 1200}
                       onChange={handleEloChange}
                       label="ELO Rating"
                       className={styles.selectField}
                   >
                       {Array.from({ length: 13 }, (_, i) => 800 + i * 100).map((elo) => (
                           <MenuItem key={elo} value={elo} className={styles.menuItem}>
                               {elo}
                           </MenuItem>
                       ))}
                   </Select>
               </FormControl>
           </div>

       </div>
        <div className={styles.outerCtn}>
          <h3 className={styles.titleText}>Please select side to play.</h3>
          <div className={styles.innerCtn}>
            <Button
                onClick={handleUpdates('color')('w')}
                variant={gameInfoLocal.player === 'w' ? 'contained' : 'outlined'}
                startIcon={<img className={styles.icons} src={getSrc['w']['k']} />}
            >
              White
            </Button>
            <Button
                onClick={handleUpdates('color')('b')}
                variant={gameInfoLocal.player === 'b' ? 'contained' : 'outlined'}
                startIcon={<img className={styles.icons} src={getSrc['b']['k']} />}
            >
              Black
            </Button>
          </div>
        </div>
        <div className={`${styles.outerCtn} ${styles.actionBox}`}>
          <div className={styles.actionBoxInner}>
            <Button
                variant="contained"
                onClick={() => {
                  handleClose(gameInfoLocal);
                }}
            >
              Start Game
            </Button>
          </div>
        </div>
      </>
  );

  return (
      <GenericDialog
          isOpen={isOpen}
          title="Please Select the Game Mode"
          onClose={() => {}}
      >
        {dialogContent}
      </GenericDialog>
  );
};

export default StartGameDialogBox;