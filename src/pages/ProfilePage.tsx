
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserProfileForm } from '@/components/profile/UserProfileForm';

const ProfilePage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your fitness profile to get personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfileForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
