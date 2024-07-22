import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import Loader from '../components/uxComponents/loader/Loader';
import PageNotFound from '../components/uxComponents/pageNotFound/PageNotFound';
import AuthForm from '../components/auth/AuthForm';

const Game = React.lazy(() => import('../components/game/Game'));

const AppRoutes: React.FC = () => {

    return (
      <Suspense fallback={<><Loader /></>}>
          <Routes>
                <Route path="/signup" element={<AuthForm/>} />
                <Route path="/login" element={<AuthForm/>} />
                <Route path="/" element={<Layout />}>
                   <Route index element={<Game />} />
                   <Route path="*" element={<PageNotFound />} /> 
                </Route>
          </Routes>
      </Suspense>
    );
};

export default AppRoutes;
