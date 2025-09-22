import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import { LanguageProvider } from '@/context/language-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <SidebarNav />
        <main className="flex-1 flex flex-col">{children}</main>
      </SidebarProvider>
    </LanguageProvider>
  );
}
