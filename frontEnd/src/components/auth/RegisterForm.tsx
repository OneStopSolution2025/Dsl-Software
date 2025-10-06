import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema, RegisterFormData } from '@/utils/validation';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { GlassCard } from '@/components/common/GlassCard';
import api from '@/utils/axios.config';
import { API_ENDPOINTS } from '@/utils/constants';
import { RegisterResponse } from '@/types/auth.types';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await api.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        {
          username: data.username,
          email: data.email,
          password: data.password,
        }
      );

      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-8">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Create Account
      </h2>
      <p className="text-white/80 text-center mb-6">
        Sign up to get started
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('username')}
          label="Username"
          placeholder="Enter your username"
          error={errors.username?.message}
          glass
        />

        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          glass
        />

        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
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

        <div className="relative">
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            glass
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-white hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
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
          Create Account
        </Button>
      </form>

      <p className="text-center text-white/80 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-white font-semibold hover:underline">
          Login
        </Link>
      </p>
    </GlassCard>
  );
};
