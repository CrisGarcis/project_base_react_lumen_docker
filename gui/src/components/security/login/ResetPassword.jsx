import React, { useContext, useEffect, useState } from "react";
import { SecurityContext } from "../../../contexts/security/SecurityContext";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const initialState = {
  reset: {
    email: "",
    password: "",
    password_confirmation: "",
  },
};
const ResetPassword = ({ match }) => {
  const [{}, { changeToken, resetPassword }] = useContext(SecurityContext);
  const [reset, setreset] = useState(initialState.reset);
  let { params, url, path } = match;
  let { token } = params;
  useEffect(() => {
    changeToken(token);
  }, [token]);

  const sendResetPassword = (e) => {
    e.preventDefault();
    resetPassword(reset);
  };
  const setFieldReset = (field) => (e) => {
    setreset({ ...reset, [field]: e.target.value });
  };
  const [inputPassword, setinputPassword] = useState(true);
  const [inputRepeatPassword, setinputRepeatPassword] = useState(true);
  return (
    <div className="background-login">
      <div className="content-general-login">
        <form onSubmit={sendResetPassword} className="form-reset-password">
          <div className="conten-form-login">
            <h1 className="h1-login tipo-title title-reset-password">
              RESTABLECER LA CONTRASEÑA
            </h1>

            <input
              required
              name="email"
              placeholder="Email"
              value={reset.email}
              onChange={setFieldReset("email")}
              type="email"
              className="inpt-login tipo-description"
            />
            <div className="flex inpt-login bg-white">
              <input
                required
                placeholder="Contraseña"
                name="password"
                value={reset.password}
                onChange={setFieldReset("password")}
                type={inputPassword ? "password" : "text"}
                className="input-password-register tipo-description flex-1"
              />
              <FontAwesomeIcon
                onClick={() => setinputPassword(!inputPassword)}
                className="cursor-action eye-register margin-auto"
                icon={faEye}
              />
            </div>
            <div className="flex inpt-login bg-white">
              <input
                required
                value={reset.password_confirmation}
                onChange={setFieldReset("password_confirmation")}
                name="password_confirmation"
                type={inputRepeatPassword ? "password" : "text"}
                placeholder="Repita la contraseña"
                className="input-password-register tipo-description flex-1"
              />
              <FontAwesomeIcon
                onClick={() => setinputRepeatPassword(!inputRepeatPassword)}
                className="cursor-action eye-register margin-auto"
                icon={faEye}
              />
            </div>

            <div className="btn-group-login">
              <Link to="/login">
                <input
                  className=" btn-login btn-register cursor-action tipo-boton"
                  value="CANCELAR"
                  type="button"
                ></input>
              </Link>
              <input
                className="btn-login btn-up cursor-action tipo-boton"
                value="ENVIAR"
                type="submit"
              ></input>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
