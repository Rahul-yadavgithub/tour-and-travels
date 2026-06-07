import { useState } from 'react';
import PickupManager from '../components/RouteManagement/PickupManager';
import RouteBuilder from '../components/RouteManagement/RouteBuilder';
import { Map, MapPin } from 'lucide-react';

export default function RouteManagement() {
  const [activeTab, setActiveTab] = useState('pickups');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Route Management</h1>
        <p className="text-sm text-zinc-500">Manage pickup points and visual route templates for your packages.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200">
        <div className="border-b border-zinc-200">
          <nav className="flex gap-4 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pickups')}
              className={`py-4 px-2 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'pickups' 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Pickup Points
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`py-4 px-2 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'builder' 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <Map className="w-4 h-4" />
              Route Templates Builder
            </button>
          </nav>
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'pickups' && <PickupManager />}
          {activeTab === 'builder' && <RouteBuilder />}
        </div>
      </div>
    </div>
  );
}
