import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from './components/auth/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/dashboard/Dashboard';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AddUser } from './components/dashboard/AddUser';
import { EditUser } from './components/dashboard/EditUser';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/new" element={<AddUser />} />
              <Route path="/dashboard/edit/:id" element={<EditUser />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </ReactQueryProvider>
  );
}

export default App;