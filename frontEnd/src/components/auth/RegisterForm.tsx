import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { registerSchema, RegisterFormData } from '@/utils/validation';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import apiService from '@/services/api.service';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await apiService.auth.register(data.username, data.email, data.password);

      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      // Handle the detail field from API response
      const message = error.response?.data?.detail || 
                      error.response?.data?.message || 
                      'Registration failed. Please try again.';
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
            Create Account 🚀
          </h2>
          <p className="text-gray-600 text-base">
            Join thousands of professionals today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...register('username')}
            label="Username"
            placeholder="Choose a username"
            error={errors.username?.message}
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
            autoComplete="username"
          />

          <Input
            {...register('email')}
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            error={errors.email?.message}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            autoComplete="email"
          />

          <div>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Create a strong password"
              error={errors.password?.message}
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
              autoComplete="new-password"
            />
            {password && <PasswordStrengthMeter password={password} />}
          </div>

          <div>
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            className="mt-8 !bg-teal-600 hover:!bg-teal-700"
          >
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-xs">
          🔒 Your data is protected with industry-standard security
        </p>
      </div>
    </div>
  );
};
