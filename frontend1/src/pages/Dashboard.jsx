import { useDashboardStats } from '../hooks/useDashboardStats';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { 
  Image as ImageIcon, 
  CarFront, 
  Hotel, 
  Star, 
  Plus,
  ArrowRight,
  Activity
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="card flex items-center p-6">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>
    </div>
  </div>
);

const QuickAction = ({ title, description, icon: Icon, to }) => (
  <Link to={to} className="group p-5 bg-white border border-zinc-200 rounded-xl hover:border-accent hover:shadow-soft transition-all flex items-start gap-4">
    <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
        <Plus className="w-4 h-4 text-zinc-400 group-hover:text-accent transition-colors" />
      </div>
      <p className="text-xs text-zinc-500">{description}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  const { stats, loading, error } = useDashboardStats();
  const { user } = useUser();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-zinc-500">Loading dashboard...</div>;
  }

  // Calculate profile completion (mock logic based on user data presence)
  const profileComplete = [user?.firstName, user?.lastName, user?.imageUrl].filter(Boolean).length;
  const completionPercent = Math.round((profileComplete / 3) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Welcome back, {user?.firstName || 'Guide'}</h1>
        <p className="text-sm text-zinc-500 mt-1">Here's a snapshot of your guide business today.</p>
      </div>

      {/* Profile Completion Bar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-zinc-900">Profile completion</span>
            <span className="text-xs font-semibold text-zinc-700">{completionPercent}%</span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Complete your profile to appear higher on the customer site.</p>
        </div>
        <Link to="/settings" className="btn btn-secondary whitespace-nowrap text-sm h-9">
          Complete <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          Couldn't load stats: {error}. Check your backend server.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Portfolio photos" 
          value={stats.totalPhotos || 0} 
          icon={ImageIcon} 
          colorClass="bg-zinc-100 text-zinc-600" 
        />
        <StatCard 
          title="Cars listed" 
          value={stats.totalCars || 0} 
          icon={CarFront} 
          colorClass="bg-zinc-100 text-zinc-600" 
        />
        <StatCard 
          title="Hotels listed" 
          value={stats.totalHotels || 0} 
          icon={Hotel} 
          colorClass="bg-zinc-100 text-zinc-600" 
        />
        <StatCard 
          title="Pending reviews" 
          value={stats.pendingReviews || 0} 
          icon={Star} 
          colorClass="bg-amber-100 text-amber-600" 
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-zinc-900">Quick actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickAction title="Add portfolio photo" description="Upload a new image to your gallery." icon={ImageIcon} to="/portfolio" />
            <QuickAction title="Add a car" description="List a new vehicle for customers." icon={CarFront} to="/services/cars" />
            <QuickAction title="Add a hotel" description="Add a partner hotel offering." icon={Hotel} to="/services/hotels" />
            <QuickAction title="Review pending reviews" description="Approve or reject customer feedback." icon={Star} to="/reviews" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-zinc-900">Recent activity</h3>
          <div className="card p-5 h-[200px] flex flex-col">
            <ul className="space-y-4 flex-1">
              <li className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-success shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-900">Dashboard ready</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Connect your backend to see live updates.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-zinc-300 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-900">Sign in with Clerk</p>
                  <p className="text-xs text-zinc-500 mt-0.5">JWT is attached to every API call automatically.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
