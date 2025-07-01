import React from 'react';
import styles from './ChessLabelStyles.module.css';

interface RankLabelProps {
  rank: string;
  rankIndex: number;
}

const RankLabel: React.FC<RankLabelProps> = ({ rank, rankIndex }) => {
  return (
    <span 
      className={
        `${styles.rankLabel} 
         ${rankIndex % 2 === 0 ? styles.lightColorTxt : styles.darkColorTxt}`
      }
    >
      {rank}
    </span>
  );
};

export default RankLabel;