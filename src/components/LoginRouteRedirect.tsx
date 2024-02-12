import { Navigate } from "react-router-dom";

const LoginRouteRedirect = ({ element }: { element: JSX.Element }) => {
  if (localStorage.getItem("userId") !== "") {
    return <Navigate to="/hub" />;
  }

  return element;
};

export default LoginRouteRedirect;
