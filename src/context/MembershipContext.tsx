
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MembershipContextType {
  hasMembership: boolean;
  isLoading: boolean;
  checkMembership: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const MembershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [hasMembership, setHasMembership] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkMembership = async () => {
    if (!user) {
      setHasMembership(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
        
      if (error) {
        console.error('Error checking membership:', error);
        setHasMembership(false);
      } else {
        setHasMembership(!!data);
      }
    } catch (error) {
      console.error('Error checking membership:', error);
      setHasMembership(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMembership();
  }, [user]);

  return (
    <MembershipContext.Provider value={{ hasMembership, isLoading, checkMembership }}>
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
