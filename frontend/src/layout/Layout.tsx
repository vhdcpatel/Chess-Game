import React from 'react';
import { Outlet } from 'react-router-dom'
import styles from './LayoutStyles.module.css'
import HeaderBar from '../components/header/HeaderBar';

const flagNew = false;

const Layout = () => {    
    
    return (
        flagNew ? (
            <React.Fragment>
                <div className={styles.mainOuterCtn}>
                    <HeaderBar />
                    <main className={styles.mainBody}>
                        <Outlet />
                    </main>
                </div>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <div className={styles.mainOuterCtnNew}>
                    <aside className={styles.sidebar}>Sidebar</aside>
                    <main className={styles.mainContent}>
                        <Outlet />
                    </main>
                </div>
            </React.Fragment>
        )
    );
};

export default Layout;