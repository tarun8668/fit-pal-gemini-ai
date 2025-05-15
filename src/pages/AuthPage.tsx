
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { toast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const { user, loading, signIn } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
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
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Sign in to your account</h2>
          
          <div className="space-y-4">
            <Button 
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 transition-all py-6"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <FcGoogle className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
            
            <div className="text-center text-sm text-gray-400 mt-4">
              <p>
                By continuing, you agree to our{' '}
                <a href="#" className="text-white hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-white hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
