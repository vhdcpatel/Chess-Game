import React from 'react';
import styles from './Loader.module.css';
import { CircularProgress } from '@mui/material';
import logo from '../../../assets/chessLogoMain.jpg';

const Loader: React.FC = () => {
    return (
        <React.Fragment>
            <div className={styles.mainOuterDiv}>
                <div className={styles.progressContainer}>
                    <CircularProgress size={60} thickness={2.5} />
                    <div className={styles.overlay}>
                        <div className={styles.imgCtn}>
                            <img className={styles.logoImg} src={logo} alt="Chess Logo" />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Loader;