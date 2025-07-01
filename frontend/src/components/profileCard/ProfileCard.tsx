import React from 'react';
import { Avatar } from '@mui/material';
import styles from './ProfileCard.module.css';
import settingsIcon from '../../assets/icons/CogIcon.svg';

interface ProfileCardProps {
  avatarSrc: string;
  name: string;
  status?: string;
  onSettingsClick?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarSrc,
  name,
  status = 'Free',
  onSettingsClick = () => {},
}) => (
  <div className={styles.card}>
    <Avatar
      className={styles.avatar}
      src={avatarSrc}
      alt={`${name}'s avatar`}
      sx={{ width: 48, height: 48 }}
    >
      M 
    </Avatar>

    <div className={styles.info}>
      <span className={styles.name}>{name}</span>
      <span className={styles.status}>{status}</span>
    </div>

    <button
      type="button"
      className={styles.settingsButton}
      onClick={onSettingsClick}
      aria-label="Settings"
    >
      
      <img
        src={settingsIcon}
        alt="Settings"
        className={styles.settingsIcon}
      />
    </button>
  </div>
);

export default ProfileCard;
