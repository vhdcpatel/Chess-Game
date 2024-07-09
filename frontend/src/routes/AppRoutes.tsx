import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';

const Game = React.lazy(() => import('../components/game/Game'));

const AppRoutes: React.FC = () => {

    return (
      <Suspense fallback={<div>Loading...</div>}>
          <Routes>
                <Route path="/" element={<Layout />}>
                   <Route index element={<Game />} />
                </Route>
          </Routes>
      </Suspense>
    );
};

export default AppRoutes;
