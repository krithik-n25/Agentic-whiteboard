"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { applyAppearance, getSettings, useSettings } from "@/lib/settings";

function Provider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<any>(null);

  // Text size + font from Settings (the <head> script did it before paint; this keeps it in sync)
  const settings = useSettings();
  useEffect(() => {
    // getSettings(), not `settings`: during hydration `settings` is still the default
    applyAppearance(getSettings());
  }, [settings]);
  const { isLoaded, isSignedIn, user } = useUser();

  // Only a signed-in user has a DB row. Before login (landing page) there is
  // nothing to fetch, and after logout the old details are cleared.
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      CreateNewUser();
    } else {
      setUserDetails(null);
    }
  }, [isLoaded, isSignedIn, user?.id]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/user");
      setUserDetails(result.data);
    } catch (error) {
      console.error("Failed to load user details", error);
    }
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {/* setUserDetails is shared so credits / board count update without a refresh */}
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <div>{children}</div>
      </UserDetailContext.Provider>
    </ThemeProvider>
  );
}

export default Provider;
