
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="glass-morphism border-b border-slate-700/60 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden text-slate-300 hover:bg-slate-800/50">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="text-xl font-bold text-gradient">
          NightFit AI
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
