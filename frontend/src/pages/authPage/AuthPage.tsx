import { useEffect } from "react";
import AuthForm from "../../components/auth/AuthForm"
import { useAuth } from "../../context/authContext/authContext";
import styles from './AuthPage.module.css';
import { useNavigate } from "react-router-dom";

const AuthPage = () => {

  // If user already logged in then redirect to HomePage.
  const { isAuthenticated }= useAuth();
  const navigator = useNavigate();
  
  useEffect(()=>{
    if(isAuthenticated){
      navigator('/');
    }
  },[])
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <AuthForm />
        </div>
      </div>
    </>
  )
}

export default AuthPage