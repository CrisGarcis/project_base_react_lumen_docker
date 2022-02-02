import React from "react";
import "./General.css";
import Header from "../layout/Header";
import Menu from "../layout/Menu";
let initialState = {
  company: {
    id: "",
    name: "",
    nit: "",
  },
};

const GeneralLayout = ({ children }) => {
  return (
    <div className="flex flex-wrap" style={{ height: "100vh", width: "100%" }}>
      <Header />
      <Menu />
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default GeneralLayout;
