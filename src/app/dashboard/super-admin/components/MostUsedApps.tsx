import React from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, Package, MessageSquare, Wrench } from 'lucide-react';

interface AppLink {
  id: string;
  name: string;
  icon: string;
  route: string;
}

// Static app links - no API needed
const staticApps: AppLink[] = [
  {
    id: '1',
    name: 'Accounting',
    icon: 'Calculator',
    route: '/dashboard/super-admin/accounting'
  },
  {
    id: '2',
    name: 'Inventory',
    icon: 'Package',
    route: '/dashboard/super-admin/inventory'
  },
  {
    id: '3',
    name: 'Cross Messaging',
    icon: 'MessageSquare',
    route: '/dashboard/super-admin/messaging'
  },
  {
    id: '4',
    name: 'Repair tracking',
    icon: 'Wrench',
    route: '/dashboard/super-admin/repairs'
  }
];

const iconMap = {
  Calculator,
  Package,
  MessageSquare,
  Wrench,
};

export default function MostUsedApps() {
  const router = useRouter();

  const handleAppClick = (app: AppLink) => {
    router.push(app.route);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Most Used App</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {staticApps.map((app) => {
          const IconComponent = iconMap[app.icon as keyof typeof iconMap] || Calculator;
          
          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="text-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-lg p-2"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <IconComponent className="w-8 h-8 text-pink-500" />
              </div>
              <p className="text-sm font-medium text-gray-900">{app.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
} 