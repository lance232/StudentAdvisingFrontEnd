import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { BookOpen, Mail, Lock, AlertCircle, Eye, EyeOff, Shield, UserCog, GraduationCap } from 'lucide-react';
import { loginUser, registerUser } from '../../api/auth';

// USJ-R Logo SVG Component
const USJRLogo = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <circle cx="50" cy="50" r="48" fill="#16a34a" stroke="#ca8a04" strokeWidth="3"/>
    <text x="50" y="45" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle">USJ</text>
    <text x="50" y="70" fontSize="20" fontWeight="bold" fill="#fbbf24" textAnchor="middle">-R</text>
  </svg>
);

interface LoginProps {
  onLogin: (role: 'adviser' | 'student' | 'chairman', userData?: { name: string; id: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [signupRole, setSignupRole] = useState<'adviser' | 'student' | 'chairman'>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (mode === 'login') {
      // Basic client-side validation
      if (!idNumber || !password) {
        setError('Please enter both ID number and password');
        setIsLoading(false);
        return;
      }

      if (idNumber.length !== 10) {
        setError('ID number must be exactly 10 digits');
        setIsLoading(false);
        return;
      }

      try {
        const data = await loginUser({ userId: idNumber, password });
        onLogin(data.role, { name: data.name, id: data.userId });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'signup') {
      // Validation for signup
      if (!fullName || !idNumber || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (idNumber.length !== 10) {
        setError('ID number must be exactly 10 digits');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }

      // Validate ID format based on signup role
      const expectedPrefix = signupRole === 'student' ? '20' : signupRole === 'chairman' ? '30' : '10';
      if (!idNumber.startsWith(expectedPrefix)) {
        setError(`${signupRole === 'student' ? 'Student' : signupRole === 'chairman' ? 'Chairman' : 'Adviser'} IDs must start with ${expectedPrefix}`);
        setIsLoading(false);
        return;
      }

      try {
        await registerUser({
          userId: idNumber,
          name: fullName,
          password,
          confirmPassword,
        });

        setSuccess('Account created successfully! Please sign in.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create account.');
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'forgot') {
      // Validation for forgot password
      if (!idNumber) {
        setError('Please enter your ID number');
        setIsLoading(false);
        return;
      }

      if (idNumber.length !== 10) {
        setError('ID number must be exactly 10 digits');
        setIsLoading(false);
        return;
      }

      // Simulate password reset
      setTimeout(() => {
        setSuccess('Password reset link sent to your registered email!');
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg p-1">
              <USJRLogo />
            </div>
            <div>
              <h1 className="font-bold text-2xl text-green-800">
                University of San Jose - Recoletos
              </h1>
              <p className="text-yellow-600 font-semibold">Academic Advising System</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex lg:hidden items-center gap-3 mb-4 justify-center">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg p-1">
                  <USJRLogo />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm font-semibold text-green-800 mb-1">University of San Jose - Recoletos</p>
                <CardTitle className="text-2xl">
                  {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                </CardTitle>
                <CardDescription>
                  {mode === 'login' 
                    ? 'Sign in to access your dashboard' 
                    : mode === 'signup'
                    ? 'Create your account to get started'
                    : 'Enter your email to receive a password reset link'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                {mode === 'signup' && (
                  <>
                    {/* Account Type Selector */}
                    <div className="space-y-2">
                      <Label>Create Account As</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSignupRole('student')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            signupRole === 'student'
                              ? 'border-green-600 bg-green-50 text-green-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                          }`}
                        >
                          <GraduationCap className="h-5 w-5 mx-auto mb-1" />
                          <div className="font-semibold text-sm">Student</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignupRole('adviser')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            signupRole === 'adviser'
                              ? 'border-green-600 bg-green-50 text-green-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                          }`}
                        >
                          <UserCog className="h-5 w-5 mx-auto mb-1" />
                          <div className="font-semibold text-sm">Adviser</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignupRole('chairman')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            signupRole === 'chairman'
                              ? 'border-green-600 bg-green-50 text-green-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                          }`}
                        >
                          <Shield className="h-5 w-5 mx-auto mb-1" />
                          <div className="font-semibold text-sm">Chairman</div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Juan Dela Cruz"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder={
                        mode === 'signup' 
                          ? signupRole === 'student' 
                            ? '2021001234' 
                            : '1000000001'
                          : '10 digits ID'
                      }
                      value={idNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        if (value.length <= 10) {
                          setIdNumber(value);
                        }
                      }}
                      className="pl-10 h-11"
                      disabled={isLoading}
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enter your 10-digit ID number (10***** for Adviser, 20***** for Student)</p>
                </div>

                {mode !== 'forgot' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-11"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {mode === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 h-11"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-sm text-green-700 hover:text-green-800 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white shadow-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending...'}
                    </span>
                  ) : (
                    mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'
                  )}
                </Button>

                {mode === 'login' && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode('signup');
                            setError('');
                            setSuccess('');
                          }}
                          className="text-green-700 hover:text-green-800 font-semibold"
                        >
                          Create Account
                        </button>
                      </p>
                    </div>
                  </>
                )}

                {(mode === 'signup' || mode === 'forgot') && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setError('');
                          setSuccess('');
                          setPassword('');
                          setConfirmPassword('');
                          setFullName('');
                        }}
                        className="text-green-700 hover:text-green-800 font-semibold"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          © 2026 University of San Jose - Recoletos. All rights reserved.
        </p>
      </div>
    </div>
  );
}