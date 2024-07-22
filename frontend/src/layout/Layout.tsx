import { Outlet, useNavigate } from 'react-router-dom'
import styles from './LayoutStyles.module.css'
import HeaderBar from '../components/header/HeaderBar';
import { useEffect } from 'react';
import { useAuth } from '../context/authContext/authContext';

const Layout = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // Redirect to login page if user is not authenticated
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, navigate]);
    
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