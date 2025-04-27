import { useMemo } from 'react'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types/user';

// Zod schema for user form validation
const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  status: z.enum(['active', 'locked'])
});

// Type definition for the API response structure
type ApiResponse = {
  result: {
    data?: {
      user?: User;
    };
    message: string;
  };
};

export function AddUser() {
  // Access query client for cache management
  const queryClient = useQueryClient();
  // Get access token from auth store
  const { accessToken } = useAuthStore();
  // Navigation hook for redirecting
  const navigate = useNavigate();

  // Form handling with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors } // Only keep what we need (removed isSubmitting and reset)
  } = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema)
  });


  // Mutation options for creating a new user
  const mutationOptions = useMemo(() => ({
  // Function to call the API and create a new user
    mutationFn: async (userData: Omit<User, 'id'>) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
  
      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create user');
      }
      return response.json() as Promise<ApiResponse>;
    },
    // On successful mutation:
    // 1. Invalidate users query to refresh data
    // 2. Show success toast
    // 3. Navigate back to dashboard
    onSuccess: (data: ApiResponse) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(data.result.message, { autoClose: 3000 });
      navigate('/dashboard');
    },
    // Show error toast when mutation fails
    onError: (error: Error) => {
      toast.error(error.message, { autoClose: 3000 });
    }
  }), [queryClient, navigate, accessToken]);

  // Initialize the mutation with the defined options
  const { mutate, isPending } = useMutation(mutationOptions);

  // Form submission handler
  const onSubmit = (data: z.infer<typeof userSchema>) => {
    mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Create New User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name Field */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">First Name*</label>
          <input
            {...register('firstName')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
  
        {/* Last Name Field (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
  
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Email*</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
  
        {/* Date of Birth Field */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Date of Birth*</label>
          <input
            type="date"
            {...register('dateOfBirth')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>
  
        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Status*</label>
          <select
            {...register('status')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="locked">Locked</option>
          </select>
        </div>
  
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}