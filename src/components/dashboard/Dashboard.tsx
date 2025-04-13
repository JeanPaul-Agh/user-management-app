import { useState, useEffect } from 'react';
import { useAuthStore, useThemeStore } from '../../store';
import { UserCard } from './UserCard';
import { User } from '../../types/user'; 

export function Dashboard() {
  
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Store hooks for auth and theme
  const { accessToken } = useAuthStore();
  const { isDark } = useThemeStore();

  // Fetch users data when search or token changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users?search=${encodeURIComponent(search)}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setUsers(data.result?.data?.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    if (accessToken) fetchUsers();
  }, [search, accessToken]);

  return (
    <>
      <div className={`container mx-auto p-4 ${isDark ? 'dark:bg-gray-900' : 'bg-gray-50'}`}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className={`px-4 py-2 rounded-md border ${isDark ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 w-[250px]`}
        />  
      </div>

      <main className="container mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : users.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'dark:text-white' : 'text-gray-600'}`}>
            {search ? 'No users found matching your search' : 'No users available'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} isDark={isDark} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}