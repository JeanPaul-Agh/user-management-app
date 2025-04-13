import { User } from '../../types/user';

interface UserCardProps {
  user: User;
  isDark: boolean;
}

export function UserCard({ user, isDark }: UserCardProps) {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg ${isDark ? 'dark:bg-gray-800' : 'bg-white'}`}>
      <div className="p-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3251D0] text-white flex items-center justify-center text-2xl font-bold">
          {user.firstName.charAt(0)}{user.lastName?.charAt(0) || ''}
        </div>
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
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 bg-[#3251D0] text-white rounded-md hover:bg-blue-700 transition">
              Edit
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}