
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          FitPal AI
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
