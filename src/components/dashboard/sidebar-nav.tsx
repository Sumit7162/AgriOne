'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  CloudSun,
  LayoutDashboard,
  Leaf,
  MessageSquare,
  Settings,
  Store,
  Tractor,
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crop-health', label: 'Crop Health', icon: Leaf },
  { href: '/farming-plans', label: 'Farming Plans', icon: ClipboardList },
  { href: '/weather-alerts', label: 'Weather Alerts', icon: CloudSun },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/forums', label: 'Forums', icon: MessageSquare },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Tractor className="w-8 h-8 text-primary" />
          <span className="font-headline text-2xl group-data-[collapsible=icon]:hidden">
            AgriSuper
          </span>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter className="p-2">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="#">
                        <Settings/>
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
