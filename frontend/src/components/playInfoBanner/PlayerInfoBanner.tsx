import React from 'react';
import styles from './playerInfoBanner.module.css';
import {  playerColor, TCapturePieces } from '../../features/chessGame/chessModel';
import StockFishLogo from '../../assets/users/stockFishLogo.png';
import userImage from '../../assets/users/userImage.png';
import { getSrc } from '../../utils/constants/srcMap';
import { PieceSymbol } from 'chess.js';

interface IPlayerInfoBannerProps {
  player: playerColor;
  flagSinglePlayer: boolean;
  capturedPieces: TCapturePieces
  currentPlayer: playerColor;
}

const GetImageForPlayer = (CurrentPlayer: playerColor, activePlayer: playerColor, flagSinglePlayer: boolean): string => {
  
  if (flagSinglePlayer && CurrentPlayer !== activePlayer) {
    // Return StockFish logo for the opponent AI player.
    return StockFishLogo;
  }

  return userImage;
}

const PlayerInfoBanner: React.FC<IPlayerInfoBannerProps> = (props) => {
  
  const {
    player,
    capturedPieces,
    currentPlayer,
    flagSinglePlayer
  } = props;

  
  return (
    <div className={
      `${styles.outerCtn} 
      ${player === 'w' ? styles.whitePlayer : styles.blackPlayer}`
    }>
      <div className={styles.playerInfoCtn}>
        <div className={styles.profilePictureCtn}>
          <img src={GetImageForPlayer(currentPlayer, player, flagSinglePlayer)} alt="Player Profile Picture" />
        </div>
        <div className={styles.playerNameCtn}>
          <div className={styles.playerName}>
            &nbsp;
            800
          </div>
          <div className={styles.playerStatus}>
            {Object.entries(capturedPieces).length > 0 && (
              <div>
                <span>Capture Pieces</span>
                <ul>
                  {Object.entries(capturedPieces).map(([piece, count]) => {
                    const imgSrc = getSrc[currentPlayer][piece as PieceSymbol];
                    return (
                      <li key={piece}>
                        <span>{piece}</span>
                        <img
                          src={imgSrc}
                          className={styles.capturedPieceImage}
                          alt={`Captured ${piece}`}
                          title={`Captured ${piece}`}
                        />
                        x
                        <span>({count})</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
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