
'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  Tractor,
  Landmark,
  Shield,
} from 'lucide-react';
import { useTranslation } from '@/context/language-context';

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { href: '/government-schemes', label: t('sidebar.schemes'), icon: Shield },
    { href: '/mandi-prices', label: t('sidebar.mandi_prices'), icon: Landmark },
    { href: '/settings', label: t('sidebar.settings'), icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 p-2">
            <Tractor className="w-8 h-8 text-primary" />
            <span className="font-headline text-2xl group-data-[collapsible=icon]:hidden">
                {t('common.app_name')}
            </span>
        </Link>
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
    </Sidebar>
  );
}
