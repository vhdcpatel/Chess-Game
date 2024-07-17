import React from 'react';
import styles from './Loader.module.css';
import { Box, CircularProgress } from '@mui/material';
import logo from '../../../assets/chessLogoMain.jpg'

const Loader: React.FC = () => {

  return (
    <React.Fragment>
      <Box className={styles.mainOuterDiv}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={60} thickness={2.5}/>
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box className={styles.imgCtn}>
              <img className={styles.logoImg} src={logo} alt="Chess Logo"/>
            </Box>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Loader;

