import React, { useEffect, useState, useContext } from "react";
import axios from "../axios/axios-client";
import axiosOrigin from "axios";

import { useLocation, useHistory } from "react-router-dom";
import { AlertContext } from "../alerts/AlertContext";
import Swal from "sweetalert2";
import cloneDeep from "lodash/cloneDeep";

export const STATUS_LOADING = "LOADING";
export const STATUS_NOT_LOADED = "NOT_LOADED";
export const STATUS_NOT_LOGGED_IN = "NOT_LOGGED_IN";
export const STATUS_LOADED = "STATUS_LOADED";
export const STATUS_LOGGED_IN = "LOGGED_IN";
export const STATUS_SELECT_PLANT = "SELECT_PLANT";
export const STATUS_ACTIVE = 2;
export const STATUS_CREATED = 1;

export const STATUS_INACTIVE = 3;
export const STATUS_FINISH = 8;
export const STATUS_REJECTED = 9;
export const STATUS_INPROGRESS = 7;
const publicIp = require("public-ip");
let initalState = {
  status: STATUS_NOT_LOADED,
  user: {
    id: "",
    first_name: "",
    last_name: "",
    plant: null,
    bg1: { backgroundColor: "#264a6d" },
    cl1: { color: "#264a6d" },
    cl2: { color: "#264a6d" },
    permissions: [],
  },

  errors: {
    error: [],
    status: false,
  },
};

export const SecurityContext = React.createContext([]);

export const SecurityContextProvider = ({ children }) => {
  let location = useLocation();
  let history = useHistory();
  const [{}, { alertSuccess, alertWarning, alertError, showErrors }] =
    useContext(AlertContext);
  let [state, setState] = React.useState(initalState);
  let [errors, setErrors] = useState(initalState.errors);
  const [loginWorker, setloginWorker] = useState(initalState.loginWorker);
  const [initBtnLogin, setinitBtnLogin] = useState(false);
  //manejo de errores
  useEffect(() => {
    if (errors.status) {
      showErrors(errors.error);
      setErrors({ ...errors, status: false });
    }
  }, [errors]);

  useEffect(() => {
    if (state.status === STATUS_NOT_LOADED) {
      setState({ ...state, status: STATUS_LOADING });
      axios()
        .get("security/getuser")
        .then(( {data} ) => {
          if (data) {
            setState({ ...state, user: data, status: STATUS_LOGGED_IN });
          }else{
            setState({ ...state, status: STATUS_NOT_LOGGED_IN });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (
      state.status === STATUS_LOGGED_IN &&
      /^\/login/.test(location.pathname)
    ) {
      if (
        location.state &&
        location.state.referer &&
        !/^\/login/.test(location.state.referer)
      ) {
        //si viene con parametros en url y le dio click al boton login

        if (initBtnLogin) {
          if (location.state.referer.split("/").includes("select-plant")) {
            history.replace(location.state.referer);
          }
        } else {
          history.replace(location.state.referer);
        }
      } else {
        history.replace("/app/library/topics");
      }
    } else if (state.status === STATUS_LOGGED_IN) {
      if (location.pathname.split("/").includes("select-plant")) {
        //despues de seleccionar planta

        history.replace(`app/general/plant/${appencode(state.user.plant.id)}`);
      }
    }
  }, [state]);

  useEffect(() => {
    if (state.status === STATUS_LOGGED_IN && state.user.plant) {
      async function getData() {
        const permissions = await getPermissionsPlant();
        let plant = state.user.plant;

        setState({
          ...state,
          user: {
            ...state.user,
            permissions: permissions,
            bg1: { backgroundColor: "#" + plant.color1 },
            bg2: { backgroundColor: "#" + plant.color2 },
            bg3: { backgroundColor: "#" + plant.color3 },
            cl1: { color: "#" + plant.color1 },
            cl2: { color: "#" + plant.color2 },
            cl3: { color: "#" + plant.color3 },
          },
        });
      }
      getData();
    }
  }, [state.status]);
  useEffect(() => {
    if (state.status === STATUS_LOGGED_IN && state.user.plant) {
      let plant = state.user.plant;

      setState({
        ...state,
        user: {
          ...state.user,
          bg1: { backgroundColor: "#" + plant.color1 },
          bg2: { backgroundColor: "#" + plant.color2 },
          bg3: { backgroundColor: "#" + plant.color3 },
          cl1: { color: "#" + plant.color1 },
          cl2: { color: "#" + plant.color2 },
          cl3: { color: "#" + plant.color3 },
        },
      });
    }
  }, [
    state.user.plant && state.user.plant.color1,
    state.user.plant && state.user.plant.color2,
    state.user.plant && state.user.plant.color3,
  ]);
  const refreshUser = () => {
    setState({ ...state, status: STATUS_NOT_LOADED });
  };

  const can = (permission) => {
    if (state.user.is_admin) {
      return true;
    }
    if (state.user.permissions) {
      return state.user.permissions.includes(permission);
    } else {
      return false;
    }
  };
  const getPermissionsPlant = async () => {
    return axios()
      .get("security/getPermissions")
      .then(({ data }) => {
        return data;
      })
      .catch((e) => {
        if (e.request.status === 401) {
          logout();
        } else if (e.request.status === 422) {
          setErrors({ error: e.response.data, status: true });
        } else if (e.request.status === 403) {
          history.push("/app/unauthorized");
        } else {
          alertError("Error al intentar obtener los permisos");
        }
      });
  };
  const changePlant = (plant) => {
    if (localStorage) {
      localStorage.setItem("plant_id", `${plant.id}`);
    }
    let stateclone = cloneDeep(state);
    stateclone.user.plant = plant;
    stateclone.status = STATUS_LOGGED_IN;
    setState(stateclone);
  };
  useEffect(() => {
    if (state.status === STATUS_SELECT_PLANT) {
      if (state.user.user_plants.length === 1) {
        changePlant(state.user.user_plants[0]);
        return false;
      }

      history.replace("/select-plant", { referer: location.pathname });
    } else if (
      state.status !== STATUS_LOGGED_IN &&
      /^\/app/.test(location.pathname)
    ) {
      history.replace("/login", { referer: location.pathname });
    }
  }, [location.pathname, state.status]);

  const login = async (email, password) => {
    if (loginWorker) {
      return false;
    }
    setloginWorker(true);
    let ip = await publicIp.v4();
    registerLogin(email, password, { ip_address: ip });
  };

  const registerLogin = (email, password, data) => {
    axios()
      .get("security/getuser")
      .then(({ data }) => {
        if (!data.id) {
          //inicio de sesion sin token de usuario vigente
          setState({ ...state, status: STATUS_LOADING });
          axios()
            .post("security/login", { email, password, data: data })
            .then(({ data }) => {
              if (localStorage) {
                localStorage.setItem("token", `Bearer ${data.token}`);
                if (data.plant) {
                  localStorage.setItem("plant_id", `${data.plant.id}`);
                }
              }
              setState({ ...state, status: STATUS_NOT_LOADED });
            })
            .catch((e) => {
              if (e.request.status === 422) {
                setErrors({ error: e.response.data, status: true });
              } else if (e.request.status === 401) {
                setErrors({ error: e.response.data, status: true });
              }
              setState({
                ...state,
                status: STATUS_NOT_LOGGED_IN,
              });
              setloginWorker(false);
            });
        } else {
          //el usuario inicia sesion teniendo ya una  activa
          window.location.reload(false);
        }
      });
  };

  const register = async (
    first_name,
    last_name,
    email,
    password,
    repeat_password,
    token
  ) => {
    const taken = token;
    if (password != repeat_password) {
      alertWarning("Las contraseñas no coinciden");
      return false;
    }
    setState({ ...state, loadingRegister: true });

    axios()
      .post("security/person", {
        first_name,
        last_name,
        email,
        password,
        taken,
      })
      .then(({ data }) => {
        setState({ ...state, loadingRegister: false });
        history.push("/login");
        Swal.fire({
          title: "Activa tu cuenta",
          text: "Se ha enviado un enlace a tu correo para activar tu cuenta ",
          icon: "success",
          confirmButtonColor: "#df8c37",
          confirmButtonText: "¡Entendido!",
        }).then((result) => {});
      })
      .catch((e) => {
        setState({ ...state, loadingRegister: false });
        if (e.request.status === 422) {
          setErrors({ error: e.response.data, status: true });
        } else {
          alertError("Error al registrar");
        }
      });
  };

  const logout = () => {
    let token = localStorage.getItem("token");
    let plant = localStorage.getItem("plant_id");
    if (plant) {
      localStorage.removeItem("plant_id");
    }
    if (token) {
      localStorage.removeItem("token");
      setState({ ...initalState, status: STATUS_NOT_LOADED });
      window.location.reload(false);
    }
  };
  const sendEmailPassword = (email) => {
    axios()
      .post(`security/password/email`, { email: email })
      .then(({ data }) => {
        Swal.fire({
          title: "Se ha enviado un link al correo",
          text: "Puede llegar a la lista de spam o notificaciones",
          icon: "success",
          confirmButtonColor: "#df8c37",
          cancelButtonColor: "#171e27",
          confirmButtonText: "Entendido",
        }).then((result) => {});
      })
      .catch((e) => {
        if (e.request.status === 422) {
          setErrors({ error: e.response.data, status: true });
        } else if (e.request.status === 403) {
          history.push("/app/unauthorized");
        } else {
          alertError("Error al enviar el correo");
        }
      });
  };
  const shortText = (text, range) => {
    if (text.length > range) {
      return text.substr(0, range) + "...";
    } else {
      return text;
    }
  };
  const resetPassword = ({ email, password, password_confirmation }) => {
    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("token", state.tokenReset);

    formData.append("password_confirmation", password_confirmation);

    axios()
      .post("security/password/reset/" + state.tokenReset, formData)
      .then(({ data }) => {
        alertSuccess("Contraseña restablecida");
        history.replace("/login");
        logout();
      })
      .catch((e) => {
        if (e.request.status === 422) {
          setErrors({ error: e.response.data, status: true });
        } else {
          alertError("Error al modificar la contraseña");
        }
      });
  };
  const setColorsPagination = () => {
    if (state.user) {
      const user = state.user;
      var x = document.getElementsByClassName("item-page-app");
      for (let i = 0; i < x.length; i++) {
        const li = x[i];
        if (li.classList.contains("active")) {
          let a = li.getElementsByClassName("page-link-app");
          if (a) {
            a = a[0];
            a.style.setProperty(
              "background",
              "#" + user.plant.color1,
              "important"
            );
            a.style.setProperty("color", "#fff", "important");
          }
        } else {
          let a = li.getElementsByClassName("page-link-app");
          if (a) {
            a = a[0];
            a.style.setProperty("background", "#fff", "important");
            a.style.setProperty("color", "#" + user.plant.color1, "important");
          }
        }
      }
    }
  };
  const setColorToggle = () => {
    var x = document.querySelectorAll(".react-toggle-track");

    setTimeout(function () {
      for (let i = 0; i < x.length; i++) {
        const element = x[i];
        const parent = element.parentElement;
        if (parent.classList.contains("react-toggle--checked")) {
          element.style.setProperty(
            "background",
            "#" + state.user.plant.color1,
            "important"
          );
        } else {
          element.style.setProperty("background", "#4D4D4D", "important");
        }
      }
    }, 100);
  };

  const getSrcDocumentWithBearer = async (document) => {
    let token = "";
    if (localStorage) {
      token = localStorage.getItem("token") || "";
    }

    return axiosOrigin
      .create({
        baseURL: process.env.REACT_APP_API_HOST,
        headers: {
          Authorization: token,
          plant: state.user.plant.id,
        },
        responseType: "arraybuffer",
      })
      .get("documents/" + document.name)
      .then(({ data }) => {
        const blob = new Blob([data], {
          type: "*",
        });
        var objectURL = URL.createObjectURL(blob);
        return objectURL;
      })
      .catch((e) => {});
  };
  const appencode = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };

  function appdecode(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }
  const stylesSelect = {
    control: (base) => ({
      ...base,
      border: "1px solid #d1d3d4",

      // This line disable the blue border
      boxShadow: "0 !important",
      "&:hover": {
        borderColor: "0 !important",
      },
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? state.user.cl1.color : null,
        color: "#333333",
      };
    },
  };
  const pluck = (arr, key) => arr.map((i) => i[key]);
  return (
    <SecurityContext.Provider
      value={[
        state,

        {
          login,
          logout,
          setState,
          sendEmailPassword,
          shortText,
          setColorsPagination,
          can,
          setColorToggle,
          getSrcDocumentWithBearer,
          appdecode,
          appencode,
          stylesSelect,
          pluck,
        },
        {},
      ]}
    >
      {children}
    </SecurityContext.Provider>
  );
};
