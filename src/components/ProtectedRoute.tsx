import { Navigate } from "react-router-dom";

import GetCookie from "../core/application/lib/GetCookie";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const cookie = GetCookie("jwt");
  if (cookie === undefined) {
    localStorage.setItem("username", "");
    localStorage.setItem("userId", "");
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
