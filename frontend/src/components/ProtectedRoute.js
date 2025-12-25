import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(userDataContext);

  if (!userData || !userData.token) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
