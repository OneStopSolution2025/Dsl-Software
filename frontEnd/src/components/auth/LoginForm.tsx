import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/utils/validation';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import apiService from '@/services/api.service';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { resetStepper } from '@/store/slices/stepperSlice';
import { clearFiles } from '@/store/slices/filesSlice';

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    dispatch(loginStart());

    try {
      const response = await apiService.auth.login(data.username, data.password);

      // Extract token from OAuth2 response (access_token) or fallback to token field
      const token = response.access_token || response.token || '';

      // Create user object from response or use username from form
      const user = response.user || {
        id: data.username,
        username: data.username,
        email: '', // Email not provided in OAuth2 token response
      };

      dispatch(loginSuccess({
        token,
        user,
      }));

      // Reset all app state to ensure fresh start for every login session
      dispatch(resetStepper());
      dispatch(clearFiles());

      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      dispatch(loginFailure(message));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 text-base">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...register('username')}
            label="Username"
            name="username"
            placeholder="Enter your username"
            error={errors.username?.message}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            autoComplete="username"
          />

          <div>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              name='password'
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            className="mt-8 !bg-teal-600 hover:!bg-teal-700"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors hover:underline"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-xs">
          🔒 Secured with bank-level encryption
        </p>
      </div>
    </div>
  );
};
