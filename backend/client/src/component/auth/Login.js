import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    console.log("hi");

    e.preventDefault();

    console.log(formData);
  };

  return (
    <div>
      <section className="container">
        <div className="alert alert-danger">Invalid Credentials</div>

        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign into your account
        </p>
        <form
          action="dashboard.html"
          className="form"
          onSubmit={(e) => onSubmit(e)}
        >
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              minLength="6"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <input type="submit" value="Login" className="btn btn-primary" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="\register">Sign Up</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
