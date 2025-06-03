import { Outlet } from 'react-router-dom'
import styles from './LayoutStyles.module.css'
import HeaderBar from '../components/header/HeaderBar';

const Layout = () => {
    
    return (
        <div className={styles.mainOuterCtn}>
            <HeaderBar />
            <main className={styles.mainBody}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;