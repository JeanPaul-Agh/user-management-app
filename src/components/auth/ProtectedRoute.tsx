import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';

export function ProtectedRoute() {
  const { accessToken, expiresIn, clearToken } = useAuthStore();
  const location = useLocation();

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const isTokenExpired = expiresIn ? expiresIn < currentTimestamp : true;

  if (!accessToken || isTokenExpired) {
    if (accessToken) clearToken();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
}