import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { authDataContext } from './AuthContext';
export const adminDataContext = createContext();


const AdminContext = ({ children }) => {
  const [adminData, setadminData] = useState(null);
  const { serverUrl } = useContext(authDataContext);

  const getAdmin = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/getCurrentAdmin", { withCredentials: true });
      setadminData(result.data);
      console.log(result.data);
    }
    catch (err) {
      setadminData(null);
      console.log("getAdmin error", err.response?.data || err.message);
    }

  }

  useEffect(() => {
    getAdmin();
  }, [])

  const value = {
    adminData,
    setadminData,
    getAdmin
  }

  return (
    <adminDataContext.Provider value={value}>
      {children}
    </adminDataContext.Provider>
  );
}

export default AdminContext;
