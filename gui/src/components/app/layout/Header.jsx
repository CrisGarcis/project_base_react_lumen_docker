import React, { useContext } from "react";
import {
  SecurityContext,
  STATUS_SELECT_PLANT,
} from "../../../contexts/security/SecurityContext";
import { useLocation, useHistory } from "react-router-dom";
import "./Header.css";
import { AlertContext } from "../../../contexts/alerts/AlertContext";
const Header = () => {
  let history = useHistory();
  const [state, { setState }] = useContext(SecurityContext);
  let { user } = state;


 
  return (
    <div className="header-app-general">
     
     header
    </div>
  );
};

export default Header;
