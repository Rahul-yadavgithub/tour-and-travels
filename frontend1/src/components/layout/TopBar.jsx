import { UserButton, useUser } from '@clerk/clerk-react';
import { Menu, Bell } from 'lucide-react';

const TopBar = ({ toggleSidebar }) => {
  const { user, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white border-b border-zinc-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {isLoaded && user && (
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-zinc-900">Welcome back,</p>
            <p className="text-xs text-zinc-500">{user.firstName || user.fullName}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-zinc-200"></div>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9"
            }
          }}
        />
      </div>
    </header>
  );
};

export default TopBar;
