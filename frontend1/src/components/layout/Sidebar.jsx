import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  CarFront, 
  Hotel, 
  Star, 
  Settings,
  Package
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Enquiries', path: '/enquiries', icon: Star },
    { name: 'Package Management', path: '/packages', icon: Package },
    { name: 'Route Management', path: '/route-management', icon: LayoutDashboard },
    { name: 'Portfolio', path: '/portfolio', icon: Image },
    { name: 'Car Services', path: '/services/cars', icon: CarFront },
    { name: 'Hotel Services', path: '/services/hotels', icon: Hotel },
    { name: 'Reviews', path: '/reviews', icon: Star },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-zinc-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-zinc-200
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-16 items-center px-6 border-b border-zinc-200">
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            GuideStudio
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
