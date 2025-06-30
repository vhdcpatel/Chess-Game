import React from 'react';
import styles from './playerInfoBanner.module.css';
import { playerColor } from '../../features/chessGame/chessModel';
import StockFishLogo from '../../assets/users/stockFishLogo.png';
import userImage from '../../assets/users/userImage.png';

interface IPlayerInfoBannerProps {
  player: playerColor;
  flagSinglePlayer: boolean;
}

const PlayerInfoBanner: React.FC<IPlayerInfoBannerProps> = (props) => {
  const {
    player,
    flagSinglePlayer
  } = props;

  
  return (
    <div className={
      `${styles.outerCtn} 
      ${player === 'w' ? styles.whitePlayer : styles.blackPlayer}`
    }>
      <div className={styles.playerInfoCtn}>
        <div className={styles.profilePictureCtn}>
          {/* Profile Picture */}
          <img src={player === 'b' ? StockFishLogo : userImage} alt="Player Profile Picture" />
        </div>
        <div className={styles.playerNameCtn}>
          <div className={styles.playerName}>
            {/* Player Name */}
            {player === 'b' ? 'StockFish' : 'You'}
            &nbsp;
            800
          </div>
          <div className={styles.playerStatus}>
            {/*Add logic for lost pieces */}
          </div>
        </div>
      </div>
      <div>
        {/* Add Watch Here in future. */}
      </div>

    </div>
  )
}

export default PlayerInfoBanner