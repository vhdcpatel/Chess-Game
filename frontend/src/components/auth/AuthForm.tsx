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

  const handleRedirectPage = ()=>{
    navigator('/');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(form.email, form.password);
        // Redirect or show success message
      } else {
        await signUp(form);
        // Redirect or show success message
      }
    } catch (error) {
      console.error(error);
      // Show error message
    }
  };

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
      <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
    </form>
  );
};

export default AuthForm;
