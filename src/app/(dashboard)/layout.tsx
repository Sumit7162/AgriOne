import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <main className="flex-1 flex flex-col">{children}</main>
    </SidebarProvider>
  );
}
