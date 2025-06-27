import React from 'react'
import styles from './SideBar.module.css'

const SideBar = () => {
  return (
    <aside className={styles.sidebarOuterCtn}>
      <div className={styles.sidebarTop}>
        <h1>Sidebar</h1>
        {/* Logo / static top content */}
      </div>

      <div className={styles.sidebarMiddle}>
        {/* This fills remaining space */}
      </div>

      <div className={styles.sidebarBottom}>
        {/* Use Profile goes here. */}
      </div>
    </aside>
  )
}

export default SideBar