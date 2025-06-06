
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { useMembership } from '@/context/MembershipContext';

interface SubscriptionStatusBarProps {
  onUpgrade?: () => void;
}

export const SubscriptionStatusBar: React.FC<SubscriptionStatusBarProps> = ({ onUpgrade }) => {
  const { hasMembership, expiresAt, isExpired } = useMembership();

  if (!hasMembership && !isExpired) {
    return null;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isExpired) {
    return (
      <Card className="border-red-200 bg-red-50 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Subscription Expired</p>
              <p className="text-sm text-red-600">
                Your premium membership expired on {expiresAt ? formatDate(expiresAt) : 'Unknown'}
              </p>
            </div>
          </div>
          <Button onClick={onUpgrade} size="sm" className="bg-red-600 hover:bg-red-700">
            Renew Now
          </Button>
        </div>
      </Card>
    );
  }

  if (hasMembership && expiresAt) {
    const daysRemaining = getDaysRemaining(expiresAt);
    const isExpiringSoon = daysRemaining <= 7;

    return (
      <Card className={`p-4 mb-6 ${isExpiringSoon ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className={`h-5 w-5 ${isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}`} />
            <div>
              <div className="flex items-center gap-2">
                <p className={`font-medium ${isExpiringSoon ? 'text-yellow-800' : 'text-green-800'}`}>
                  Premium Active
                </p>
                <Badge variant={isExpiringSoon ? "destructive" : "default"} className="text-xs">
                  {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expires today'}
                </Badge>
              </div>
              <p className={`text-sm ${isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}`}>
                Expires on {formatDate(expiresAt)}
              </p>
            </div>
          </div>
          {isExpiringSoon && (
            <Button onClick={onUpgrade} size="sm" variant="outline">
              Extend
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return null;
};
