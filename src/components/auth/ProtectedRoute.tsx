import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { DashboardLayout } from '../dashboard/DashboardLayout';

export function ProtectedRoute() {
  const { accessToken, expiresIn, clearToken } = useAuthStore();
  const location = useLocation();

  // Token expiration check
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const isTokenExpired = expiresIn ? expiresIn < currentTimestamp : true;

  // Redirect to login if no valid token
  if (!accessToken || isTokenExpired) {
    if (accessToken) clearToken(); 
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <DashboardLayout><Outlet /></DashboardLayout>;
}