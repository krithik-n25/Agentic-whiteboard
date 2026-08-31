import AppHeader from "@/components/custom/dashboard/AppHeader";
import { AppSidebar } from "@/components/custom/dashboard/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <AppHeader />
        </header>

        <main className="flex-1 bg-background">
          <div className="p-5">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}