import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';

const AuthForm: React.FC = () => {
  const { login, signUp } = useAuth();
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

  const handledNavigation = (type: 'home' | 'singUp' |'logIn')=>{
    if(type === 'home'){
      navigator('/', { replace: true });
    }else if(type === 'singUp'){
      navigator('/signup');
    }else{
      navigator('/login');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(form.email, form.password);
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
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <>
          <input name="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
          <input name="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="Last Name" required />
          <input name="userName" type="text" value={form.userName} onChange={handleChange} placeholder="Username" required />
        </>
      )}
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
      <p onClick={()=>{handledNavigation(isLogin ? "singUp": "logIn")}}>{message}</p>
      <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
    </form>
  );
};

export default AuthForm;
