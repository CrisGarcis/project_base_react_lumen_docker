import React, { useContext, useState } from "react";
import "../layout/Menu.css";
import { SecurityContext } from "../../../contexts/security/SecurityContext";
import gestion from "../../../images/menu/Gestion.png";
import empresa from "../../../images/menu/Empresa.png";
import auditoria from "../../../images/menu/Auditoria.png";

import puesto from "../../../images/menu/Puesto_critico.png";
import reporte from "../../../images/menu/Reportes.png";
import seguridad from "../../../images/menu/Seguridad.png";
import { Link, Switch, Route, Router, useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
let initialState = {

};
const Menu = () => {
  let history = useHistory();
  let [{ user }, { logout, can, appencode }] = useContext(SecurityContext);
 
  return (
    <>
      <div className="flex container-menu">
        menu
        <div
          onClick={logout}
          className="container-logout-menu front-title app-color-black flex w-100 app-bg-color-gray-white"
        >
          <div className="margin-auto font-title ">
            <FontAwesomeIcon icon={faPowerOff} />
            &nbsp;<span>Cerrar sesión</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
