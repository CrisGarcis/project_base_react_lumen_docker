import React, { Component, useEffect } from "react";
import "./Login.css";
import { SecurityContext } from "../../../contexts/security/SecurityContext";
import { Link } from "react-router-dom";
import CRhonos from "../../../images/login/Logologin.png";
const Login = () => {
  let [securityState, securityActions] = React.useContext(SecurityContext);
  let [state, setState] = React.useState({ email: "", password: "" });

  let setField = (field) => (e) => {
    setState({ ...state, [field]: e.target.value });
  };

  const userLogin = (e) => {
    e.preventDefault();
    securityActions.login(state.email, state.password);
  };
  return (
    <div className="general-div-login">
      <div className="general-central-login">
        <div className="content-white-logo-login">
          <div className="logo-login"></div>
        
        </div>

        <div className="content-form-login">
        <div className="title-app-login txt-center font-title app-color-black w-100">
              <strong>Titulo del sistema</strong>{" "}
          </div>
          <h3 className="title-login app-color font-title">Iniciar Sesión</h3>
          <form
            className="form-auth form-login form-login-mobile"
            onSubmit={userLogin}
          >
            <div className="flex input-login-default">
              <div>
                <div className="icon-user-login"></div>
              </div>
              <div className="flex flex-1">
                <input
                  className="app-color-gray-white input-login"
                  onChange={setField("email")}
                  value={state.email}
                  type="email"
                  placeholder="Correo"
                />
              </div>
            </div>
            <br />

            <div className="flex input-login-default">
              <div className="flex">
                <div className="icon-pass-login"></div>
              </div>
              <div className="flex flex-1">
                <input
                  className="app-color-gray-white input-login flex flex"
                  onChange={setField("password")}
                  value={state.password}
                  type="password"
                  placeholder="Contraseña"
                />
              </div>
            </div>
            <div className="flex content-remember-pass-login justify-betwen">
              <div className="flex ">
                <div>
                  <input type="checkbox" name="" id="" />&nbsp;
                </div>
                <span className="record-pass-app app-color-gray-white">Recordar</span>
              </div>
              <div className="flex  app-color-gray-white ">
                <Link
                  className="no-link resetpass-login-text"
                  to={`/mailResetPassword`}
                >
                  Recuperar contraseña
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <input
                className="app-btn-default font-title btn-log-in"
                type="submit"
                value="Entrar"
              />
            </div>
          </form>
        </div>
      </div>
      <img className="logo-crhonos-login" src={CRhonos} alt="" />
    </div>
  );
};

export default Login;
