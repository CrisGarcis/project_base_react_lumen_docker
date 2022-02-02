import React from "react";
import GeneralLayout from "./layout/General";
import { Switch, Route, Router, useHistory } from "react-router-dom";

import Unauthorized from "./aplication/unauthorized";


const App = ({ match }) => {
  let history = useHistory();
  return (
    <GeneralLayout>
      <Switch>
        <Switch path={`${match.path}/unauthorized`}>
          <Unauthorized />
        </Switch>
      </Switch>
    </GeneralLayout>
  );
};

export default App;
