
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MembershipContextType {
  hasMembership: boolean;
  isLoading: boolean;
  checkMembership: () => Promise<void>;
  membershipDetails: any;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const MembershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [hasMembership, setHasMembership] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [membershipDetails, setMembershipDetails] = useState(null);

  const checkMembership = async () => {
    if (!user) {
      setHasMembership(false);
      setMembershipDetails(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Checking membership for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
        
      if (error) {
        console.error('Error checking membership:', error);
        setHasMembership(false);
        setMembershipDetails(null);
      } else {
        console.log('Membership data:', data);
        setHasMembership(!!data);
        setMembershipDetails(data);
      }
    } catch (error) {
      console.error('Error checking membership:', error);
      setHasMembership(false);
      setMembershipDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMembership();
  }, [user]);

  // Set up real-time subscription to membership changes
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for user:', user.id);
    
    const channel = supabase
      .channel('membership-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_memberships',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Membership change detected:', payload);
          checkMembership();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up membership subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <MembershipContext.Provider value={{ 
      hasMembership, 
      isLoading, 
      checkMembership, 
      membershipDetails 
    }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};
