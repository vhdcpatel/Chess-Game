import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';
import styles from './authForm.module.css';

const AuthForm: React.FC = () => {
  const { login, signUp, authError } = useAuth();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const navigator = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handledNavigation = (type: 'home' | 'signUp' |'logIn')=>{
    if(type === 'home'){
      navigator('/', { replace: true });
    }else if(type === 'signUp'){
      navigator('/signup');
    }else{
      navigator('/login');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({email: form.email,password: form.password});
        handledNavigation('home');
      } else {
        await signUp(form);
        handledNavigation('home');
      }
    } catch (error) {
      console.error(error);

      // Show error message
    }
  };
  
  const message = isLogin ? 'Don\'t have account signUp.' : 'Already have account login.'; 

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formTitle}>{isLogin ? 'Log In' : 'Sign Up'}</div>
      {!isLogin && (
        <>
          <label className={styles.inputLabel} htmlFor="firstName">First Name</label>
          <input
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className={styles.inputField}
            required
          />
          <label className={styles.inputLabel} htmlFor="lastName">Last Name</label>
          <input
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className={styles.inputField}
            required
          />
          <label className={styles.inputLabel} htmlFor="userName">Username</label>
          <input
            name="userName"
            type="text"
            value={form.userName}
            onChange={handleChange}
            placeholder="Username"
            className={styles.inputField}
            required
          />
        </>
      )}
      <label className={styles.inputLabel} htmlFor="email">Email</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className={styles.inputField}
        required
      />
      <label className={styles.inputLabel} htmlFor="password">Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className={styles.inputField}
        required
      />
       <p onClick={() => handledNavigation(isLogin ? 'signUp' : 'logIn')} className={styles.toggleMessage}>
        {message}
      </p>
      {authError && <p className={styles.toggleMessage}>
        {authError}
      </p>}
      <button type="submit" className={styles.submitButton}>
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
