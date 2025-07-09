'use client'
import { useSidebar } from "../hooks/use-sidebar";
import { useStore } from "../hooks/use-store";
import { cn } from "@/lib/utils";
import Sidebar from "./sidebar";
import { AdminPanelLayoutProps } from "./admin-panel-layout-props";

export default function AdminPanelLayout({
  session,
  children,
}: AdminPanelLayoutProps) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;


  return (
    <>
      <Sidebar
        session={session}
      />
      <main
        className={cn(
          "min-h-screen bg-muted/40 transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
      </footer>
    </>
  );
}
