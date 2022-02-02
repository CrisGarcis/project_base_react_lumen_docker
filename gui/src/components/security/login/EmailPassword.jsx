import React, { useContext, useEffect, useState } from "react";
import { SecurityContext } from "../../../contexts/security/SecurityContext";
import Header from "../../app/layout/Header";
import { Link } from "react-router-dom";
import "./EmailPassword.css";
const EmailPassword = () => {
  const initialState = {
    email: "",
  };
  const [email, setemail] = useState(initialState.email);
  const [{}, { sendEmailPassword }] = useContext(SecurityContext);
  const sendEmail = (e) => {
    e.preventDefault();
    sendEmailPassword(email);
  };
  return (
    <div className="background-login">
      <div className="w-100" style={{ position: "fixed" }}>
        {/* <Header /> */}
      </div>
      <div className="content-general-login">
        <form className="form-auth form-login" onSubmit={sendEmail}>
          <div className="conten-form-login">
            <h1 className="h1-login tipo-title title-reset-password">
              RESTABLECER LA CONTRASEÑA
            </h1>

            <input
              className="inpt-reset-password-mail inpt-login tipo-description"
              type="email"
              onChange={(e) => setemail(e.target.value)}
              value={email}
              placeholder="CORREO ELECTRÓNICO"
            ></input>

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

export default EmailPassword;
