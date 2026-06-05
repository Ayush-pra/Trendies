import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { serverUrl } = useContext(authDataContext);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/getCurrentUser", {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
      // Clear stale localStorage if backend says unauthenticated
      localStorage.removeItem("user");
    }
  };

  const logout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUserData(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      await getCurrentUser();
      setAuthLoading(false);
    };
    verifyAuth();
  }, []);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
    authLoading,
    logout,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
