"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={3000}
        expand={false}
        visibleToasts={3}
      />
    </ThemeProvider>
  );
}
