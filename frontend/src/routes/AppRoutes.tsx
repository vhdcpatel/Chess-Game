import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import Loader from '../components/uxComponents/loader/Loader';
import ProtectedRoutes from './ProtectedRoutes';

const Game = React.lazy(() => import('../pages/index/Game'));
const AuthPage = React.lazy(() => import('../pages/authPage/AuthPage'));
const PageNotFound = React.lazy(() => import('../components/uxComponents/pageNotFound/PageNotFound'));

const AppRoutes: React.FC = () => {

	return (
		<Suspense fallback={<Loader/>}>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path={"/login"} element={<AuthPage />} />
					<Route path={"/signup"} element={<AuthPage />} />
					<Route path="/" element={<ProtectedRoutes />}>
						<Route index element={<Game />} />
						<Route path="*" element={<PageNotFound />} />
					</Route>
				</Route>
			</Routes>
		</Suspense>
	);
};

export default AppRoutes;
