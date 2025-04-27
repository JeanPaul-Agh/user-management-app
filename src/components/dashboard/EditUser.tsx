import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '../../types/user';


 // Zod schema for user form validation
 // Defines validation rules for user editing form fields 
const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  status: z.enum(['active', 'locked'])
});

// Type definition for API response structure
type ApiResponse = {
  result: {
    data?: {
      user?: User;
    };
    message: string;
  };
};


// EditUser component provides a form to edit existing user details
// Handles data fetching, form validation, and submission
export function EditUser() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  // Form handling with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors }, // ← Only keep what we need
    reset
  } = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema)
  });

  // Fetch user data to populate the form
  useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json() as ApiResponse;
      reset(data.result.data?.user); 
      return data;
    },
    enabled: !!id && !!accessToken // Only fetch when required data is available
  });

   // Mutation for updating user data
   // Handles API call, success/error states 
  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async (updatedUser: Omit<User, 'id'>) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(updatedUser)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json() as Promise<ApiResponse>;
    },
    onSuccess: (data: ApiResponse) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      // Show success notification and redirect
      toast.success(data.result.message, { autoClose: 3000 });
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating user');
    }
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof userSchema>) => {
    updateUser(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Edit User</h2>
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
  
        {/* Last Name Field */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
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
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
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
                Updating...
              </span>
            ) : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
}