"use client";

import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SnackbarProvider maxSnack={3} autoHideDuration={4000}>
        {children}
      </SnackbarProvider>
    </SessionProvider>
  );
}
