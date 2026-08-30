import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import type { Metadata } from "next";
import Provider from './provider';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Agentic Whiteboard",
  description: "Agentic Whiteboard is a collaborative platform that allows users to create, share, and collaborate on digital whiteboards in real-time. It provides a seamless experience for brainstorming, planning, and visualizing ideas with team members or clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
        <body style={{ margin: 0, padding: 0 }}>
          <Provider>
            {children}
          </Provider>

        </body>
      </html>
    </ClerkProvider>
  );
}