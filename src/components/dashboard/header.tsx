
'use client';
import type { FC, PropsWithChildren } from 'react';
import {
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { useTranslation } from '@/context/language-context';

export const Header: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  const translateTitle = (title: React.ReactNode): React.ReactNode => {
    if (typeof title !== 'string') return title;

    switch (title) {
      case 'Dashboard':
        return t('dashboard.title');
      case 'Crop Health':
        return t('crop_health.title');
      case 'Weather & Pest Alerts':
        return t('weather_alerts.title');
       case 'Mandi Prices':
        return t('mandi_prices.title');
      case 'Personalized Farming Plans':
        return t('farming_plans.title');
      case 'Marketplace':
        return t('marketplace.title');
      case 'Community Forums':
        return t('forums.title');
      case 'Settings':
        return t('settings.title');
      default:
        return title;
    }
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
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" alt="User" data-ai-hint="person avatar"/>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
};
