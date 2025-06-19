import React, { useState } from 'react';
import styles from '../Game.module.css';
import { Button, Slider } from '@mui/material';
import { getSrc } from '../../../utils/constants/srcMap';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import { gameInfoModel } from '../Game';
import GenericDialog from "../../dialogBox/GenericDialog";


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


  const getEloDescription = (elo: number): string => {
        if (elo < 1000) return "Beginner";
        if (elo < 1200) return "Novice";
        if (elo < 1400) return "Intermediate";
        if (elo < 1600) return "Advanced";
        if (elo < 1800) return "Expert";
        return "Master";
    };

// Update your handleEloChange function
  const handleEloChange = (_event: Event, newValue: number | number[]) => {
        setGameInfoLocal({ ...gameInfoLocal, elo: newValue as number });
  };

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
      <div className={styles.eloSliderContainer}>
              <h4 className={styles.eloLabel}>ELO Rating</h4>
              <div className={styles.eloSliderWrapper}>
                  <Slider
                      value={gameInfoLocal.elo || 1200}
                      onChange={handleEloChange}
                      min={800}
                      max={2000}
                      step={100}
                      marks={[
                          { value: 800, label: '800' },
                          { value: 1200, label: '1200' },
                          { value: 1600, label: '1600' },
                          { value: 2000, label: '2000' }
                      ]}
                      valueLabelDisplay="on"
                      className={styles.eloSlider}
                      classes={{
                          root: styles.sliderRoot,
                          track: styles.sliderTrack,
                          thumb: styles.sliderThumb,
                          valueLabel: styles.sliderValueLabel,
                          markLabel: styles.sliderMarkLabel,
                          mark: styles.sliderMark,
                          markActive: styles.sliderMarkActive
                      }}
                  />
              </div>
              <div className={styles.eloDescription}>
                <span className={styles.eloDescText}>
                  {getEloDescription(gameInfoLocal.elo || 1200)}
                </span>
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