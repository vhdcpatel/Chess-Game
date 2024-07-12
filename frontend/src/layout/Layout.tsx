import { Outlet } from 'react-router-dom'
import styles from './LayoutStyles.module.css'
import HeaderBar from '../components/header/HeaderBar';
import { useUser } from '../context/userContext/userContext';
import { useEffect } from 'react';

const Layout = () => {
    const { user, setUser } = useUser();

    useEffect(() => {
        console.log(user);
    }, [user])


    useEffect(()=>{
        // const user = localStorage.getItem('user');
        // if(user){
        //     setUser(JSON.parse(user));
        console.log("Test");
        
        setUser({
            name: 'John Doe',
            email: 'test@g.com',
            isLogged: true,
            isDarkMode: false
        })
    },[setUser])
    
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