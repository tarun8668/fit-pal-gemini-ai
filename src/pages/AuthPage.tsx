import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { toast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({
          title: "Sign up successful",
          description: "Please check your email to verify your account.",
        });
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Consist</h1>
          <p className="text-gray-400 mb-8">Your AI-powered fitness companion</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </h2>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
              disabled={isLoading}
            />
            
            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
              disabled={isLoading}
            />

            {/* Email Sign In/Up Button */}
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-100 transition-all py-6"
              disabled={isLoading}
            >
              {isSignUp ? 'Sign up with Email' : 'Sign in with Email'}
            </Button>

            {/* Toggle Sign In/Up */}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>

            <div className="text-center text-gray-300">or</div>

            {/* Google Sign-In */}
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 transition-all py-6"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
