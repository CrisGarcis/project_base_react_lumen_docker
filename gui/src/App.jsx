import React, { useEffect } from "react";
import "./App.css";
import "./css/toggle.css";


import Login from "./components/security/login/Login";

import AppRouter from "./components/app/router";
import ResetPassword from "./components/security/login/ResetPassword";
import EmailPassword from "./components/security/login/EmailPassword";

import {
  SecurityContextProvider,
  SecurityContext,
  STATUS_LOADING,
  STATUS_NOT_LOADED,
} from "./contexts/security/SecurityContext";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { AlertContextProvider } from "./contexts/alerts/AlertContext";

const AppRender = ({ match }) => {
  let [security] = React.useContext(SecurityContext);

  if (
    security.status === STATUS_LOADING ||
    security.status === STATUS_NOT_LOADED
  ) {
    return (
      <div className="flex container-loading">
        <div className="margin-auto">
          Cargando...
          <div className="background-simple gif-loading"></div>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/resetPassword/:token" component={ResetPassword} />
      <Route path="/mailResetPassword" component={EmailPassword} />
      <Route path="/app" component={AppRouter} />
      <Redirect to="/app" />
    </Switch>
  );
};

const App = () => {
  return (
    <Router>
      <AlertContextProvider>
        <SecurityContextProvider>
          <AppRender />
        </SecurityContextProvider>
      </AlertContextProvider>
    </Router>
  );
};

export default App;
