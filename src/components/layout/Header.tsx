
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-white/10 p-4 flex justify-between items-center bg-black">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden text-white hover:bg-white/10">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="text-xl font-bold text-white">
          Consist
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-black text-white hover:bg-white/5">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata?.full_name || "User"} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-medium">{user.user_metadata?.name || "User"}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button variant="outline" className="border-white/10 bg-black text-white hover:bg-white/5">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};
