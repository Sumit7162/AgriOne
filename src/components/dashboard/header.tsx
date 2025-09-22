'use client';
import type { FC, PropsWithChildren } from 'react';
import {
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

export const Header: FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          {children}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
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
