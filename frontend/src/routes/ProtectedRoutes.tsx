import { Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
    // const { isAuthenticated } = useAuth();
    // const navigate = useNavigate();
    
    // Redirect to login page if user is not authenticated
    // useEffect(() => {
    //   if (!isAuthenticated) {
    //     navigate('/login');
    //   }
    // }, [isAuthenticated, navigate]);
    
    return (
        <>
          <Outlet />
        </>
    );
};

export default ProtectedRoutes;