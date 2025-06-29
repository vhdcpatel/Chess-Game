import React from 'react'
import styles from './SideBar.module.css'
import ChessMainLogo from '../../assets/chessLogoMain.jpg';
import ProfileCard from '../profileCard/ProfileCard';

const SideBar = () => {
  return (
    <aside className={styles.sidebarOuterCtn}>
      <div className={styles.sidebarTop}>
        <div className={styles.sidebarLogoCtn}>
          <img src={ChessMainLogo} alt="Chess Logo" className={styles.sidebarLogo} />
          <span className={styles.sidebarLogoText}>Chess.JS</span>
        </div>
      </div>

      <div className={styles.sidebarMiddle}>
        <div className={styles.sidebarMenuCtn}>
          Menu
        </div>
        {/* add option such as play or learn */}

        {/* This fills remaining space */}
      </div>

      <div className={styles.sidebarBottom}>
       <ProfileCard
         avatarSrc=""
         name="Anonymous"
         status="Online"
         onSettingsClick={() => console.log('Settings clicked')}
       />
      </div>
    </aside>
  )
}

export default SideBar