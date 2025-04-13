import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../../store';
import themeIcon from '../../assets/icons8-moon-symbol-50.png'; 

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  // Theme and auth management
  const { isDark, toggleTheme } = useThemeStore();
  const { clearToken } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className="p-3 sm:p-4 shadow-md dark:bg-gray-800 bg-[#3251D0]">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white whitespace-nowrap">
            User Management
          </h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm md:px-4 md:py-2 md:text-base rounded-md bg-white text-[#3251D0] font-medium hover:bg-gray-100 transition whitespace-nowrap">
              Create User
            </button>
            <button 
              onClick={handleLogout}
              className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm md:px-4 md:py-2 md:text-base bg-red-500 text-white rounded-md hover:bg-red-600 transition whitespace-nowrap"
            >
              Logout
            </button>
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-2 px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm md:px-4 md:py-2 md:text-base bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md"
            >
              <img 
                src={themeIcon} 
                alt="Theme toggle" 
                className="w-4 h-4 md:w-5 md:h-5" 
              />
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </nav>
      {children || <Outlet />}
    </div>
  );
}