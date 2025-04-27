// Dashboard.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore, useThemeStore } from '../../store';
import { UserCard } from './UserCard';
import { User } from '../../types/user';


// Dashboard component displays a list of users with search functionality
export function Dashboard() {
  const [search, setSearch] = useState('');
  const { accessToken } = useAuthStore();
  const { isDark } = useThemeStore();


  // Fetch users data with React Query
  // Automatically refetches when search term changes
  // Only enabled when accessToken is available
  // Data is considered fresh for 5 minutes (staleTime)
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', search], 
    queryFn: async () => {
      const response = await fetch(`/api/users?search=${encodeURIComponent(search)}`, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Handle API errors
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
    enabled: !!accessToken, 
    staleTime: 1000 * 60 * 5 
  });

  // Extract users array from API response or default to empty array
  const users: User[] = data?.result?.data?.users || [];

  return (
    <div className={`${isDark ? 'dark:bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="container mx-auto p-4">
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className={`px-4 py-2 rounded-md border mb-4 ${
            isDark 
              ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' 
              : 'bg-white border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md`}
        />  

        {/* Conditional Rendering based on state */}
        {error ? (
          // Error state
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error.message}
          </div>
        ) : isLoading ? (
          // Loading state
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : users.length === 0 ? (
          // Empty state
          <p className={`text-center py-8 ${isDark ? 'dark:text-white' : 'text-gray-600'}`}>
            {search ? 'No users found matching your search' : 'No users available'}
          </p>
        ) : (
          // Success state - display user cards
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user: User) => (
              <UserCard 
                key={user.id} 
                user={user} 
                isDark={isDark} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}