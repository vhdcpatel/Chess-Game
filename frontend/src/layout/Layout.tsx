import { Outlet } from 'react-router-dom'
import styles from './LayoutStyles.module.css'

const Layout = () => {
    return (
        <div className={styles.mainOuterCtn}>
            <header className={styles.header}>
              <p>This is header text</p>
            </header>
            <main className={styles.mainBody}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;