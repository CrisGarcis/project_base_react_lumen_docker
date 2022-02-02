import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";

export const AlertContext = React.createContext([]);

export const AlertContextProvider = ({ children }) => {
  //functions
  const showErrors = (errors) => {
    Swal.fire({
      icon: "warning",
      html: getError(errors),
    });
  };

  const getError = (errors) => {
    let keys = Object.keys(errors);
    let li = "";

    for (let i = 0; i < keys.length; i++) {
      li = li + "<li>" + eval("errors." + keys[i]) + "</li>";
    }
    return li;
  };
  const alertSuccess = (text) => {
    const Toast = Swal.mixin({
      toast: true,
      background: "#ffffff",
      position: "bottom-end",
      showConfirmButton: false,
      timer: 4000,
    });

    Toast.fire({
      icon: "success",
      title: text,
    });
  };
  const alertInfo = (text) => {
    const Toast = Swal.mixin({
      toast: true,
      background: "#ffffff",
      position: "bottom-end",
      showConfirmButton: false,
      timer: 4000,
    });

    Toast.fire({
      icon: "info",
      title: text,
    });
  };
  const alertWarning = (text) => {
    const Toast = Swal.mixin({
      toast: true,
      background: "#e4e4e4",
      position: "bottom-end",
      showConfirmButton: false,
      timer: 4000,
    });

    Toast.fire({
      icon: "warning",
      title: text,
    });
  };
  const alertError = (text) => {
    const Toast = Swal.mixin({
      toast: true,
      background: "#e4e4e4",
      position: "bottom-end",
      showConfirmButton: false,
      timer: 4000,
    });

    Toast.fire({
      icon: "error",
      title: text,
    });
  };

  return (
    <AlertContext.Provider
      value={[
        {},
        {
          alertInfo,
          alertSuccess,
          alertWarning,
          alertError,
          showErrors,
        },
      ]}
    >
      {children}
    </AlertContext.Provider>
  );
};
