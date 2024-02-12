import { useState } from "react";

import "../core/application/style/login.css";
import APIClient from "../core/application/lib/apiClient";
import { useNavigate } from "react-router-dom";

const initialState = {
  username: "",
  email: "",
  password: "",
  isMember: true,
};

const LoginPage = () => {
  const [values, setValues] = useState(initialState);
  const navigate = useNavigate();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { username, email, password, isMember } = values;
    if (!email || !password || (!isMember && !username)) {
      return;
    }
    const userRequest = isMember
      ? { email, password }
      : { username, email, password };
    if (isMember) {
      const apiClient = new APIClient("/login");
      const loginInfo = await apiClient.post(userRequest);
      localStorage.setItem("username", loginInfo.username);
      localStorage.setItem("userId", loginInfo.id);
      navigate("/hub");
      return;
    }
    const apiClient = new APIClient("/signup");
    await apiClient.post(userRequest);
    navigate("/login");
  };

  return (
    <LoginForm
      values={values}
      handleChange={handleChange}
      onSubmit={onSubmit}
      toggleMember={toggleMember}
    />
  );
};

export default LoginPage;

const LoginForm = ({ values, handleChange, onSubmit, toggleMember }) => {
  return (
    <div className="container">
      <form className="form" onSubmit={onSubmit}>
        <h3>{values.isMember ? "Login" : "Register"}</h3>

        {!values.isMember && (
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              placeholder="username"
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            placeholder="user@gmail.com"
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            placeholder="********"
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-block">
          {values.isMember ? "Login" : "Register"}
        </button>

        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};
