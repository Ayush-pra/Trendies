import React, { createContext } from 'react';

export const authDataContext = createContext();

const AuthContext = ({children}) => {
    const serverUrl = "https://trendies-backend-19xy.onrender.com"
    const value = {
        serverUrl
    }
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  );
}

export default AuthContext;
