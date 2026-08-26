"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

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
    <UserDetailContext.Provider value={{}}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default Provider;
