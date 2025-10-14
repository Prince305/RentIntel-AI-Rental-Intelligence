'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Building2, LayoutDashboard, Home, Users, Lightbulb, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/properties', icon: Home },
  { name: 'Tenants', href: '/tenants', icon: Users },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { organization, membership } = useOrg();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-[#001F3F] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-[#00BFA5]" />
            <span className="text-xl font-bold">RentIntel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-[#00BFA5] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-3 px-3 py-2 rounded-lg bg-white/5">
            <div className="text-sm font-medium">{organization?.name}</div>
            <div className="text-xs text-gray-400 capitalize">
              {organization?.plan} Plan • {membership?.role}
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
