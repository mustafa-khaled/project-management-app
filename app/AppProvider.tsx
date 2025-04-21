"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="h-16">
          <Header />
        </div>
        {children}
      </ThemeProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
