
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMembership } from '@/context/MembershipContext';

interface PremiumPageWrapperProps {
  children: React.ReactNode;
  featureName: string;
}

export const PremiumPageWrapper: React.FC<PremiumPageWrapperProps> = ({ 
  children, 
  featureName 
}) => {
  const { hasMembership, isLoading } = useMembership();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!hasMembership) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Premium Feature
            </CardTitle>
            <p className="text-slate-300">
              {featureName} is available for premium members only
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Premium Benefits
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Full workout programs
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Personalized diet plans
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Unlimited AI chat
                </li>
              </ul>
            </div>
            <Link to="/membership" className="block">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                Upgrade to Premium
              </Button>
            </Link>
            <Link to="/" className="block">
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
