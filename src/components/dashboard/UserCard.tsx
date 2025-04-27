import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';
import { User } from '../../types/user';
import { Link } from 'react-router-dom'; // Added for SPA navigation

interface UserCardProps {
  user: User;
  isDark: boolean;
}

// UserCard component displays a card with user information and provides edit/delete functionality
export function UserCard({ user, isDark }: UserCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  // Mutation for deleting a user
  // Handles API call, success/error states
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      // Refresh users list after successful deletion
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      setShowDeleteModal(false); 
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error deleting user');
    }
  });

  return (
    <div className={`rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg ${isDark ? 'dark:bg-gray-800' : 'bg-white'}`}>
      {/* User Card Content */}
      <div className="p-6">
        {/* User Avatar Initials */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3251D0] text-white flex items-center justify-center text-2xl font-bold">
          {user.firstName.charAt(0)}{user.lastName?.charAt(0) || ''}
        </div>
        
        {/* User Details */}
        <div className="text-left">
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'dark:text-white' : 'text-gray-900'}`}>
            {user.firstName} {user.lastName || ''}
          </h3>
          <p className={`${isDark ? 'dark:text-gray-300' : 'text-gray-600'} mb-1`}>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className={`${isDark ? 'dark:text-gray-300' : 'text-gray-600'} mb-1`}>
            <span className="font-medium">Status:</span> {user.status.toLowerCase()}
          </p>
          <p className={`${isDark ? 'dark:text-gray-300' : 'text-gray-600'} mb-4`}>
            <span className="font-medium">DOB:</span> {user.dateOfBirth}
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            {/* Edit Button - Links to edit page (now using SPA navigation) */}
            <Link
              to={`/dashboard/edit/${user.id}`}
              className="px-4 py-2 bg-[#3251D0] text-white rounded-md hover:bg-blue-700 transition"
            >
              Edit
            </Link>
            
            {/* Delete Button */}
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-xl ${isDark ? 'dark:bg-gray-700' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete {user.firstName}'s account?</p>
            <div className="flex justify-end gap-4">
              {/* Cancel Button - Closes modal */}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              
              {/* Confirm Delete Button */}
              <button
                onClick={() => mutate()}
                disabled={isPending}
                className={`px-4 py-2 text-white rounded-md transition ${
                  isPending ? 'bg-red-400' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}