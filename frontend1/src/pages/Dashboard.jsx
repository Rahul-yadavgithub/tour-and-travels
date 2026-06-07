import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { 
  Route as RouteIcon,
  Package,
  Star,
  Plus,
  Activity,
  Users
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="card flex items-center p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
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
  <Link to={to} className="group p-5 bg-white border border-zinc-200 rounded-xl hover:border-amber-500 hover:shadow-md transition-all flex items-start gap-4">
    <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
        <Plus className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
      </div>
      <p className="text-xs text-zinc-500">{description}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useUser();
  const { fetchWithAuth } = useApi();
  const [stats, setStats] = useState({ totalEnquiries: 0, totalPackages: 0, totalRoutes: 0, pendingReviews: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, activityData] = await Promise.all([
          fetchWithAuth('/dashboard/stats'),
          fetchWithAuth('/dashboard/activity')
        ]);
        setStats(statsData);
        setActivities(activityData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-zinc-500">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Welcome back, {user?.firstName || 'Admin'}</h1>
        <p className="text-sm text-zinc-500 mt-1">Here's a snapshot of your tourism business today.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          Couldn't load stats: {error}. Check your backend server.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Enquiries" 
          value={stats.totalEnquiries || 0} 
          icon={Users} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Active Packages" 
          value={stats.totalPackages || 0} 
          icon={Package} 
          colorClass="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          title="Configured Routes" 
          value={stats.totalRoutes || 0} 
          icon={RouteIcon} 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Pending Reviews" 
          value={stats.pendingReviews || 0} 
          icon={Star} 
          colorClass="bg-purple-100 text-purple-600" 
        />
      </div>

      {/* Bottom Section */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-zinc-400" /> Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction title="View Enquiries" description="Manage customer leads." icon={Users} to="/enquiries" />
            <QuickAction title="Create Package" description="Build new tour package." icon={Package} to="/packages" />
            <QuickAction title="Manage Routes" description="Configure pickup points." icon={RouteIcon} to="/route-management" />
            <QuickAction title="Review Feedback" description="Approve customer reviews." icon={Star} to="/reviews" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base font-bold text-zinc-900">Recent Activity</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory">
            {activities.length > 0 ? activities.map((activity, idx) => (
              <div key={`${activity.id}-${idx}`} className="bg-white border border-zinc-200 rounded-xl p-5 min-w-[280px] max-w-[320px] flex-shrink-0 shadow-sm hover:shadow-md transition-shadow snap-start">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-inner ${activity.type === 'enquiry' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-purple-400 to-purple-600'}`}>
                    {activity.type === 'enquiry' ? <Users className="w-5 h-5"/> : <Star className="w-5 h-5"/>}
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 text-sm">{activity.type === 'enquiry' ? 'New Enquiry' : 'New Review'}</div>
                    <time className="text-xs text-zinc-500 font-medium">{new Date(activity.date).toLocaleDateString()}</time>
                  </div>
                </div>
                <div className="text-zinc-800 font-bold text-base leading-tight mb-2 line-clamp-2">
                  {activity.title}
                </div>
                <div className="text-zinc-500 text-sm bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                  {activity.description}
                </div>
              </div>
            )) : (
              <div className="bg-white border border-zinc-200 rounded-xl p-8 w-full text-center text-zinc-500 text-sm shadow-sm">
                No recent activity yet. As soon as a customer submits an enquiry or review, it will appear here!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
