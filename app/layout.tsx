import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import type { Metadata } from "next";
import Provider from './provider';
import { Inter, Nunito, Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from '@/components/ui/toast';
import { SETTINGS_BOOT_SCRIPT } from '@/lib/settingsBoot';

// Fonts the user can pick in Settings. globals.css maps html[data-font] to --font-sans.
const inter = Inter({subsets:['latin'],variable:'--font-inter'});
const poppins = Poppins({subsets:['latin'],weight:['400','500','600','700'],variable:'--font-poppins'});
const nunito = Nunito({subsets:['latin'],variable:'--font-nunito'});

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
      <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable, poppins.variable, nunito.variable)}>
        <head>
          {/* Text size + font from Settings, applied before the first paint */}
          <script dangerouslySetInnerHTML={{ __html: SETTINGS_BOOT_SCRIPT }} />
        </head>
        <body style={{ margin: 0, padding: 0 }}>
          <Provider>
            {children}
          </Provider>
          <Toaster/>

        </body>
      </html>
    </ClerkProvider>
  );
}