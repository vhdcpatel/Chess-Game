import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import styles from './mobileBottomNavigatorStyles.module.css';

export default function MobileBottomNavigator() {
  const [value, setValue] = React.useState('game');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <BottomNavigation
        className={styles.nav}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction label="Game" value="game" icon={<SportsEsportsIcon />} />
        <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
        <BottomNavigationAction label="Profile" value="profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </div>
  );
}
