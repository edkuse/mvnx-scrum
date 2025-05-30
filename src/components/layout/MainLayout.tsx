'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutDashboard, Boxes, Layers3, MessageSquare, Flag, MessageCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: Boxes },
  { name: 'Epics', href: '/epics', icon: Layers3 },
  { name: 'Stories/Tasks', href: '/stories', icon: MessageSquare },
  { name: 'Sprints', href: '/sprints', icon: Flag },
  { name: 'Standups', href: '/standups', icon: Calendar },
  // { name: 'Reports', href: '/reports', icon: CheckCircle },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="w-full bg-[#009FDB] shadow z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <span className="text-2xl font-bold text-white tracking-tight">MVNx Scrum</span>
            <div className="flex gap-1 md:gap-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md transition
                      ${isActive ? "bg-white/10 shadow text-white" : "hover:bg-white/10 text-white/80"}
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-white
                    `}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="hidden md:inline text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-2 md:px-6">
        <Card className="w-full max-w-7xl rounded-xl shadow-lg p-6 min-h-[70vh] mt-4">
          {children}
        </Card>
      </main>
    </div>
  );
} 