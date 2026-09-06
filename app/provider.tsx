"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

function Provider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    CreateNewUser();
  }, []);

  const CreateNewUser = async () => {
    const result = await axios.post("/api/user");
    console.log(result.data);
    setUserDetails(result.data);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <UserDetailContext.Provider value={userDetails}>
        <div>{children}</div>
      </UserDetailContext.Provider>
    </ThemeProvider>
  );
}

export default Provider;
