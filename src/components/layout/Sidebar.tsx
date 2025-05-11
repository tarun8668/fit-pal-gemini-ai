
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
import { Link, useLocation } from 'react-router-dom';
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
        "fixed z-50 md:relative md:z-0 inset-y-0 left-0 glass-morphism w-64 transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-center">
          <h2 className="text-xl font-extrabold text-gradient">NightFit AI</h2>
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
          <div className="glass-morphism rounded-lg p-4 border border-purple-900/30">
            <h4 className="font-medium text-sm text-purple-300 mb-1">
              AI Assistant
            </h4>
            <p className="text-xs text-gray-300 mb-3">
              Ask me anything about your fitness journey!
            </p>
            <Link to="/chat">
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                <MessageSquare className="h-4 w-4 mr-2" /> Chat Now
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => {
  return (
    <Link 
      to={href}
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md transition-all",
        isActive 
          ? "bg-purple-900/20 text-purple-300 font-medium border-l-2 border-purple-400" 
          : "hover:bg-slate-800/50 text-slate-300 hover:text-slate-100"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};
