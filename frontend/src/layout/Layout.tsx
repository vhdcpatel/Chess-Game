import React from 'react';
import { Outlet } from 'react-router-dom'
import styles from './LayoutStyles.module.css'
import HeaderBar from '../components/header/HeaderBar';
import SideBar from '../components/SideBar/SideBar';
import MobileBottomNavigator from '../components/mobileBottomNavigator/MobileBottomNavigator';

const flagNew = false;

const TitleText = "Play Chess";

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
                    <SideBar/>
                    <main className={styles.mainContent}>
                        {/* Hide due to handle the spacing. */}
                        {/* <div className={styles.titleTxtCtn}>
                            <h1 className={styles.titleText}>{TitleText}</h1>
                        </div> */}
                        <div className={styles.outletContainer}>
                            <Outlet />
                        </div>
                        <div className={styles.mobileBottomNavigator}>
                            <MobileBottomNavigator />
                        </div>
                    </main>
                </div>
            </React.Fragment>
        )
    );
};

export default Layout;