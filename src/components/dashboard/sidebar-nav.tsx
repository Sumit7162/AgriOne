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
import { useTranslation } from '@/context/language-context';

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { href: '/', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { href: '/crop-health', label: t('sidebar.crop_health'), icon: Leaf },
    { href: '/farming-plans', label: t('sidebar.farming_plans'), icon: ClipboardList },
    { href: '/weather-alerts', label: t('sidebar.weather_alerts'), icon: CloudSun },
    { href: '/marketplace', label: t('sidebar.marketplace'), icon: Store },
    { href: '/forums', label: t('sidebar.forums'), icon: MessageSquare },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Tractor className="w-8 h-8 text-primary" />
          <span className="font-headline text-2xl group-data-[collapsible=icon]:hidden">
            AgriNova
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
                <SidebarMenuButton asChild tooltip={t('sidebar.settings')}>
                    <Link href="#">
                        <Settings/>
                        <span>{t('sidebar.settings')}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
