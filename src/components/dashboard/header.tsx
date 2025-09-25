
'use client';
import type { FC, PropsWithChildren } from 'react';
import {
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { useTranslation } from '@/context/language-context';

export const Header: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  const translateTitle = (title: React.ReactNode): React.ReactNode => {
    if (typeof title !== 'string') return title;

    const keyMap: { [key: string]: string } = {
      'Dashboard': 'dashboard.title',
      'Crop Health': 'crop_health.title',
      'Weather & Pest Alerts': 'weather_alerts.title',
      'Mandi Prices': 'mandi_prices.title',
      'Personalized Farming Plans': 'farming_plans.title',
      'Marketplace': 'marketplace.title',
      'Community Forums': 'forums.title',
      'Settings': 'settings.title',
    };

    const translationKey = keyMap[title];
    return translationKey ? t(translationKey) : title;
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          {translateTitle(children)}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <LanguageSwitcher />
        <Button variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
};
