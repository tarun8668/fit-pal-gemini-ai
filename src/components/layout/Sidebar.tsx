
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Dumbbell, 
  Apple, 
  Activity, 
  Weight, 
  History, 
  Settings,
  MessageSquare
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={cn(
        "fixed z-50 md:relative md:z-0 inset-y-0 left-0 w-64 transition-transform duration-200 ease-in-out bg-black border-r border-white/10",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b border-white/10 flex items-center justify-center">
          <h2 className="text-xl font-extrabold text-white">Consist</h2>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem 
            href="/" 
            icon={Home} 
            label="Dashboard" 
            isActive={location.pathname === '/'} 
          />
          <NavItem 
            href="/workouts" 
            icon={Dumbbell} 
            label="Workouts" 
            isActive={location.pathname === '/workouts'} 
          />
          <NavItem 
            href="/diet-plans" 
            icon={Apple} 
            label="Diet Plans" 
            isActive={location.pathname === '/diet-plans'} 
          />
          <NavItem 
            href="/calories" 
            icon={Weight} 
            label="Calories" 
            isActive={location.pathname === '/calories'} 
          />
          <NavItem 
            href="/activity" 
            icon={Activity} 
            label="Activity" 
            isActive={location.pathname === '/activity'} 
          />
          <NavItem 
            href="/schedule" 
            icon={Calendar} 
            label="Schedule" 
            isActive={location.pathname === '/schedule'} 
          />
          <NavItem 
            href="/progress" 
            icon={History} 
            label="Progress" 
            isActive={location.pathname === '/progress'} 
          />
          <NavItem 
            href="/settings" 
            icon={Settings} 
            label="Settings" 
            isActive={location.pathname === '/settings'} 
          />
        </nav>
        
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="rounded-lg p-4 border border-white/10 bg-white/5">
            <h4 className="font-medium text-sm text-white mb-1">
              AI Assistant
            </h4>
            <p className="text-xs text-gray-300 mb-3">
              Ask me anything about your fitness journey!
            </p>
            <NavLink to="/chat">
              <Button className="w-full bg-white text-black hover:bg-white/90 transition-all">
                <MessageSquare className="h-4 w-4 mr-2" /> Chat Now
              </Button>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => {
  return (
    <NavLink 
      to={href}
      className={({ isActive }) => cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md transition-all",
        isActive 
          ? "bg-white/10 text-white font-medium" 
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      )}
      end
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );
};
