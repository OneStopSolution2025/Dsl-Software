import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/utils/validation';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { GlassCard } from '@/components/common/GlassCard';
import apiService from '@/services/api.service';
import { LoginResponse } from '@/types/auth.types';
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
    <GlassCard className="p-8">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Welcome Back
      </h2>
      <p className="text-white/80 text-center mb-6">
        Sign in to continue
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('username')}
          label="Username"
          name="username"
          placeholder="Enter your username"
          error={errors.username?.message}
          glass
        />

        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            name='password'
            glass
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          className="mt-6"
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-white/80 mt-6">
        New user?{' '}
        <Link to="/register" className="text-white font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </GlassCard>
  );
};
