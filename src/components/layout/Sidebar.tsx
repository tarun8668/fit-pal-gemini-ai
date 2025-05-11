
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
  Settings 
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={cn(
        "fixed z-50 md:relative md:z-0 inset-y-0 left-0 bg-white border-r border-gray-200 w-64 transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-center">
          <h2 className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">FitPal AI</h2>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem href="/" icon={Home} label="Dashboard" isActive={true} />
          <NavItem href="/workouts" icon={Dumbbell} label="Workouts" />
          <NavItem href="/diet-plans" icon={Apple} label="Diet Plans" />
          <NavItem href="/calories" icon={Weight} label="Calories" />
          <NavItem href="/activity" icon={Activity} label="Activity" />
          <NavItem href="/schedule" icon={Calendar} label="Schedule" />
          <NavItem href="/progress" icon={History} label="Progress" />
          <NavItem href="/settings" icon={Settings} label="Settings" />
        </nav>
        
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-sm text-primary mb-1">
              AI Assistant
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Ask me anything about your fitness journey!
            </p>
            <Link to="/chat">
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Chat Now
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
        "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100",
        isActive && "bg-blue-50 text-primary font-medium"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};
