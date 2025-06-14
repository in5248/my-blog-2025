"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: "rgb(var(--primary))" },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
