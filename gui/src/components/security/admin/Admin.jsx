import React, { useContext, useState, useEffect } from "react";

import "../admin/Admin.css";
import { AdminIndexContext } from "../../../contexts/security/AdminIndexContext";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CheckboxGroup from "react-checkbox-group";
import Swal from "sweetalert2";
import Select, { components } from "react-select";
import { SecurityContext } from "../../../contexts/security/SecurityContext";
import { Link } from "react-router-dom";
export const STATUS_LOADING = "LOADING";
export const STATUS_NOT_LOADED = "NOT_LOADED";
export const STATUS_NOT_LOGGED_IN = "NOT_LOGGED_IN";
export const STATUS_LOGGED_IN = "LOGGED_IN";
export const STATUS_LOADED = "STATUS_LOADED";
const STATUS_NEW_USER = "NEW_USER";
const STATUS_SHOW_USER = "SHOW_USER";
const STATUS_EDIT_USER = "EDIT_USER";
const STATUS_NEW_PERMISSION = "NEW_PERMISSION";
const STATUS_SHOW_PERMISSION = "SHOW_PERMISSION";
const STATUS_EDIT_PERMISSION = "EDIT_PERMISSION";
const STATUS_NEW_ROLE = "NEW_ROLE";
const STATUS_SHOW_ROLE = "SHOW_ROLE";
const STATUS_EDIT_ROLE = "EDIT_ROLE";
const TAB_USER = "TAB_USER";
const TAB_PERMISSION = "TAB_PERMISSION";
const TAB_ROLE = "TAB_ROLE";

const initialState = {
  search: {
    user: "",
    permission: "",
    role: "",
  },
  user: {
    status: STATUS_NEW_USER,
    user: {
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      roles: [],
      id_number: null,
      gender: "",
      company_plant_id: null,
    },
  },
  gender: [
    { name: "Masculino", value: "M" },
    { name: "Femenino", value: "F" },
  ],
  role: {
    status: STATUS_NEW_ROLE,
    role: { id: null, name: "" },
  },
  permission: {
    status: STATUS_NEW_PERMISSION,
    permission: {
      id: null,
      name: "",
      description: "",
    },
  },
  tab: TAB_USER,
};
const Admin = () => {
  const [
    { roles, users, permissions, errors, plants },
    {
      register,
      updatePerson,
      deletePerson,
      updateRole,
      deleteRole,
      createRole,
      updatePermission,
      deletePermission,
      createPermission,
      setErrors,
      attachPermission,
      attachRole,
      filterUser,
      filterRole,
      filterPermission,
      refreshUsers,
      refreshRoles,
      refreshPermissions,
    },
  ] = useContext(AdminIndexContext);

  const [stateUsers, setUsers] = useState();
  const [state, setState] = useState(initialState);
  const [chekPermission, setCheckPermission] = useState();
  const [chekRole, setCheckRole] = useState();
  const [checkAllPermission, setcheckAllPermission] = useState(false);
  useEffect(() => {
    setUsers(users.elements);
  }, [users]);

  useEffect(() => {
    if (
      state.role.role.id != null &&
      roles.status === STATUS_LOADED &&
      roles.elements.length > 0
    ) {
      let permissionsArray = [];
      let el = roles.elements.filter((e) => e.id == state.role.role.id)[0];
      if (el.permissions) {
        for (let i = 0; i < el.permissions.length; i++) {
          permissionsArray.push(el.permissions[i].id);
        }
      }

      setCheckPermission(permissionsArray);
    }
  }, [state.role, roles]);
  useEffect(() => {
    let permissionsArray = [];
    if (checkAllPermission) {
      for (let i = 0; i < permissions.elements.length; i++) {
        permissionsArray.push(permissions.elements[i].id);
      }
    }
    setCheckPermission(permissionsArray);
  }, [checkAllPermission]);

  useEffect(() => {
    if (
      state.user.user.id != null &&
      users.status === STATUS_LOADED &&
      users.elements.length > 0
    ) {
      let rolesArray = [];
      let el = users.elements.filter((e) => e.id == state.user.user.id)[0];

      for (let i = 0; i < el.roles.length; i++) {
        rolesArray.push(el.roles[i].role_id);
      }
      setCheckRole(rolesArray);
    }
  }, [state.user, users]);
  let setFieldSearch = (field) => (e) => {
    let body = e.target.value;
    setState({
      ...state,
      search: { ...state.search, [field]: body },
    });

    if (body == "") {
      switch (field) {
        case "user":
          refreshUsers();
          break;
        case "role":
          refreshRoles();
          break;
        case "permission":
          resetPermission();
          break;
      }
    } else {
      switch (field) {
        case "user":
          filterUser(body);
          break;
        case "role":
          filterRole(body);
          break;
        case "permission":
          filterPermission(body);
          break;
      }
    }
  };

  const setTab = (tabActive) => {
    setState({ ...state, tab: tabActive });
  };
  const setStatusUser = (status_user) => {
    setState({ ...state, user: { ...state.user, status: status_user } });
  };
  const resetUser = () => {
    setState({
      ...state,
      user: {
        ...state.user,
        status: STATUS_NEW_USER,
        user: {
          ...state.user.user,
          first_name: "",
          id: null,
          last_name: "",
          roles: [],
          gender: null,
          email: "",
          password: "",
          id_number: null,
          company_plant_id: null,
        },
      },
    });
  };

  const resetPermission = () => {
    setState({
      ...state,
      search: { ...state.search, permission: "" },
      permission: {
        ...state.permission,
        status: STATUS_NEW_PERMISSION,
        permission: {
          ...state.permission.permission,
          name: "",
          description: "",

          id: null,
        },
      },
    });
  };
  const resetRole = () => {
    setState({
      ...state,
      role: {
        ...state.role,
        status: STATUS_NEW_ROLE,
        role: {
          ...state.role.role,
          name: "",
          id: null,
        },
      },
    });
  };
  const setStatusRole = (status_role) => {
    setState({ ...state, role: { ...state.role, status: status_role } });
  };
  const setStatusPermission = (status_user) => {
    setState({ ...state, user: { ...state.user, status: status_user } });
  };
  const setFieldUser =
    (field, value = null) =>
    (e) => {
      let newValue = null;
      if (value) {
        newValue = newValue;
      } else {
        if (field != "gender" && field != "company_plant_id") {
          newValue = e.target.value;
        } else if (field == "gender") {
          newValue = e;
        } else if (field == "company_plant_id") {
          newValue = e ;
        }
      }
      setState({
        ...state,
        user: {
          ...state.user,
          user: { ...state.user.user, [field]: newValue },
        },
      });
    };
  const setFieldPermission = (field) => (e) => {
    setState({
      ...state,
      permission: {
        ...state.permission,
        permission: { ...state.permission.permission, [field]: e.target.value },
      },
    });
  };
  const setFieldRole = (field) => (e) => {
    setState({
      ...state,
      role: {
        ...state.role,
        role: { ...state.role.role, [field]: e.target.value },
      },
    });
  };
  const selectUser = (user_id) => {
    let el = users.elements.filter((e) => e.id == user_id)[0];
    
    setState({
      ...state,
      user: {
        ...state.user,
        status: STATUS_SHOW_USER,
        user: {
          ...state.user.user,
          first_name: el.user.person.first_name,
          last_name: el.user.person.last_name,
          company_plant_id: el.plant,
          email:el.user.email,
          id_number: el.user.person.id_number,
          gender:
          initialState.gender.filter((g) => g.value == el.user.person.gender).length > 0
              ? initialState.gender.filter((g) => g.value == el.user.person.gender)[0]
              : "",
          id: el.id,
        },
      },
    });
  };
  const selectRole = (role_id) => {
    let el = roles.elements.filter((e) => e.id == role_id)[0];
    setState({
      ...state,
      role: {
        ...state.role,
        status: STATUS_EDIT_ROLE,
        role: el,
      },
    });
  };
  const selectPermission = (permission_id) => {
    let el = permissions.elements.filter((e) => e.id == permission_id)[0];
    setState({
      ...state,
      permission: {
        ...state.permission,
        status: STATUS_EDIT_PERMISSION,
        permission: el,
      },
    });
  };
  const savedataUser = (e) => {
    e.preventDefault();
    if (state.user.status === STATUS_NEW_USER) {
      register(state.user.user);
      setStatusUser(STATUS_NEW_USER);
    } else if (state.user.status === STATUS_EDIT_USER) {
      console.log(state.user.user);
      updatePerson(state.user.user);
      setStatusUser(STATUS_SHOW_USER);
    }
  };
  const savedataRole = (e) => {
    e.preventDefault();
    if (state.role.status === STATUS_NEW_ROLE) {
      createRole(state.role.role);
      setStatusRole(STATUS_NEW_ROLE);
    } else if (state.role.status === STATUS_EDIT_ROLE) {
      updateRole(state.role.role);
      resetRole();
    }
  };
  const savedataPermission = (e) => {
    e.preventDefault();
    if (state.permission.status === STATUS_NEW_PERMISSION) {
      createPermission(state.permission.permission);
      setStatusPermission(STATUS_NEW_PERMISSION);
    } else if (state.permission.status === STATUS_EDIT_PERMISSION) {
      updatePermission(state.permission.permission);
      resetPermission();
    }
  };
  const checkDelete = (title, functionYes, functionNot) => {
    Swal.fire({
      title: title,
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#df8c37",
      cancelButtonColor: "#171e27",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar!",
    }).then((result) => {
      if (result.value) {
        eval(functionYes);
      } else {
        eval(functionNot);
      }
    });
  };
  return (
    <div className="">
      <h3>ROLES Y PERMISOS</h3>

      <div className="content-admin-role flex-h">
        <div className="content-entity-admin flex">
          <Tabs className="tab-general-permissions">
            <TabList className="table-list-admin">
              <Tab
                onClick={() => {
                  setTab(TAB_USER);
                }}
              >
                USUARIOS
              </Tab>
              <Tab
                onClick={() => {
                  setTab(TAB_ROLE);
                }}
              >
                ROLES
              </Tab>
              <Tab
                onClick={() => {
                  setTab(TAB_PERMISSION);
                }}
              >
                PERMISOS
              </Tab>
            </TabList>

            <TabPanel>
              <input
                onChange={setFieldSearch("user")}
                type="text"
                value={state.search.user}
                className="txt-search-admin w-100"
                placeholder={`Buscar entre ${
                  stateUsers && stateUsers.length
                } usuarios`}
              ></input>
              <div className="content-list-entity-search">
                <ul className="w-100 h-100 ul-general-entity-admin">
                  {stateUsers &&
                    stateUsers.map((user_plant) => {
                      return (
                        <li
                          onClick={() => selectUser(user_plant.id)}
                          key={user_plant.id}
                          className={`cursor-action ${
                            state.user.user.id === user_plant.id
                              ? "item-active-admin"
                              : ""
                          }`}
                        >
                          {user_plant.user.person.first_name}{" "}
                          {user_plant.user.person.last_name} en{" "}
                          {user_plant.plant.name}
                        </li>
                      );
                    })}
                </ul>
              </div>
              {state.user.status !== STATUS_NEW_USER && (
                <div
                  onClick={() => resetUser()}
                  className="txt-center bg-secondary cursor-action white btn-new-entity-admin"
                >
                  CREAR NUEVO USUARIO
                </div>
              )}
            </TabPanel>
            <TabPanel>
              <input
                onChange={setFieldSearch("role")}
                type="text"
                value={state.search.role}
                className="txt-search-admin w-100"
                placeholder={`Buscar entre ${roles.elements.length} roles`}
              ></input>
              <div className="content-list-entity-search">
                <ul className="w-100 h-100 ul-general-entity-admin">
                  {roles.elements.map((role) => {
                    return (
                      <li
                        key={role.id}
                        onClick={() => selectRole(role.id)}
                        className={`cursor-action ${
                          state.role.role.id === role.id
                            ? "item-active-admin"
                            : ""
                        }`}
                      >
                        {role.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {state.role.status !== STATUS_NEW_ROLE && (
                <div
                  onClick={() =>
                    setState({
                      ...state,
                      role: {
                        ...state.role,
                        status: STATUS_NEW_ROLE,
                        role: {
                          ...state.role.role,
                          name: "",
                          id: null,
                        },
                      },
                    })
                  }
                  className="txt-center bg-orange cursor-action white btn-new-entity-admin"
                >
                  CREAR NUEVO ROL{" "}
                </div>
              )}
            </TabPanel>
            <TabPanel>
              <input
                onChange={setFieldSearch("permission")}
                type="text"
                value={state.search.permission}
                className="txt-search-admin w-100"
                placeholder={`Buscar entre ${
                  permissions.elements && permissions.elements.length
                } permisos`}
              />
              <div className="content-list-entity-search">
                <ul className="w-100 h-100 ul-general-entity-admin">
                  {permissions.elements &&
                    permissions.elements.map((per) => {
                      return (
                        <li
                          key={per.id}
                          onClick={() => selectPermission(per.id)}
                          className={`cursor-action ${
                            state.permission.permission.id === per.id
                              ? "item-active-admin"
                              : ""
                          }`}
                        >
                          {per.name}
                        </li>
                      );
                    })}
                </ul>
              </div>
              {state.permission.status !== STATUS_NEW_PERMISSION && (
                <div
                  onClick={() =>
                    setState({
                      ...state,
                      permission: {
                        ...state.permission,
                        status: STATUS_NEW_PERMISSION,
                        permission: {
                          ...state.permission.permission,
                          name: "",
                          id: null,
                        },
                      },
                    })
                  }
                  className="txt-center bg-orange cursor-action white btn-new-entity-admin"
                >
                  CREAR NUEVO PERMISO{" "}
                </div>
              )}
            </TabPanel>
          </Tabs>
        </div>
        <div className="content-permissions flex-1">
          {/* USER TAB */}
          {state.tab === TAB_USER && (
            <>
              <form onSubmit={savedataUser}>
                <div className="form-row">
                  <div className="col-md-3 ">
                    <label>Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre"
                      disabled={state.user.status === STATUS_SHOW_USER}
                      onChange={setFieldUser("first_name")}
                      value={state.user.user.first_name
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3 ">
                    <label>Apellido</label>
                    
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apellido"
                      disabled={state.user.status === STATUS_SHOW_USER}
                      onChange={setFieldUser("last_name")}
                      value={state.user.user.last_name}
                      required
                    />
                  </div>
                  <div className="col-md-6 ">
                    <label>Número de documento</label>
                
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Número de documento"
                      disabled={
                        state.user.status === STATUS_SHOW_USER ||
                        state.user.status === STATUS_EDIT_USER
                      }
                      onChange={setFieldUser("id_number")}
                      value={
                        state.user.user.id_number
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Género</label>
                    <Select  
                      placeholder={"Género"}
                      className="w-100 "
                      getOptionLabel={(option) => `${option.name}`}
                      getOptionValue={(option) => option.value}
                      options={initialState.gender}
                      isClearable={false}
                      required
                      isDisabled={state.user.status === STATUS_SHOW_USER}
                      onChange={setFieldUser("gender")}
                      value={state.user.user.gender
                      }
                      isMulti={false}
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Planta</label>

                    <Select 
                      placeholder={"Plant"}
                      className="w-100 "
                      getOptionLabel={(option) => `${option.name}`}
                      getOptionValue={(option) => option.id}
                      options={plants.elements}
                      isClearable={false}
                      required
                      isDisabled={
                        state.user.status === STATUS_SHOW_USER ||
                        state.user.status === STATUS_EDIT_USER
                      }
                      onChange={setFieldUser("company_plant_id")}
                      value={state.user.user.company_plant_id}
                      isMulti={false}
                    />
                  </div>
                  <div className="col-md-6 ">
                    <label>Correo</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Correo"
                      disabled={
                        state.user.status === STATUS_SHOW_USER ||
                        state.user.status === STATUS_EDIT_USER
                      }
                      onChange={setFieldUser("email")}
                      value={state.user.user.email}
                      required
                    />
                  </div>
                  {state.user.status === STATUS_NEW_USER && (
                    <div className="col-md-6 ">
                      <label>Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        onChange={setFieldUser("password")}
                        value={state.user.user.password}
                      />
                    </div>
                  )}
                </div>

                <br></br>
                {state.user.status === STATUS_NEW_USER && (
                  <input
                    value="Crear Usuario"
                    type="submit"
                    className="btn btn-success"
                  />
                )}
                {state.user.status === STATUS_SHOW_USER && (
                  <>
                    <input
                      value="Modo edición"
                      type="button"
                      onClick={() => setStatusUser(STATUS_EDIT_USER)}
                      className="btn btn-success"
                    />
                    <input
                      value="Eliminar"
                      type="button"
                      disabled={state.user.user.is_admin}
                      onClick={() => {
                        checkDelete(
                          "¿Realmente deseas eliminar a esta persona?",
                          "deletePerson(state.user.user.id),resetUser()"
                        );
                      }}
                      className="btn btn-danger"
                    />
                  </>
                )}
                {state.user.status === STATUS_EDIT_USER && (
                  <>
                    <input
                      value="Guardar cambios"
                      type="submit"
                      className="btn btn-info"
                    />
                    <input
                      value="Cancelar"
                      type="button"
                      onClick={() => setStatusUser(STATUS_SHOW_USER)}
                      className="btn btn-danger"
                    />
                  </>
                )}
              </form>
              {state.user.status != STATUS_NEW_USER && (
                <>
                  <CheckboxGroup
                    name="chekRole"
                    value={chekRole}
                    onChange={setCheckRole}
                  >
                    {(Checkbox) => (
                      <>
                        {roles.elements &&
                          roles.elements.map((role) => {
                            return (
                              <label key={role.id}>
                                <Checkbox value={role.id} />
                                {role.name}
                              </label>
                            );
                          })}
                      </>
                    )}
                  </CheckboxGroup>
                  <br></br>
                  <input
                    type="button"
                    value="Actualizar roles"
                    onClick={() => attachRole(chekRole, state.user.user.id)}
                    className="w-100 btn-block btn-success"
                  />
                </>
              )}
            </>
          )}
          {state.tab === TAB_ROLE && (
            <>
              <form onSubmit={savedataRole}>
                <div className="form-row">
                  <div className="col-md-6 ">
                    <label>Nombre del rol</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre"
                      disabled={state.role.status === STATUS_SHOW_ROLE}
                      onChange={setFieldRole("name")}
                      value={state.role.role.name}
                      required
                    />
                  </div>
                </div>

                <br></br>
                {state.role.status === STATUS_NEW_ROLE && (
                  <input
                    value="Crear Rol"
                    type="submit"
                    className="btn btn-success"
                  />
                )}
                {state.role.status === STATUS_SHOW_ROLE && (
                  <>
                    <input
                      value="Modo edición"
                      type="button"
                      onClick={() => setStatusRole(STATUS_EDIT_ROLE)}
                      className="btn btn-success"
                    />
                  </>
                )}
                {state.role.status === STATUS_EDIT_ROLE && (
                  <>
                    <input
                      value="Editar rol"
                      type="submit"
                      className="btn btn-info"
                    />
                    <input
                      value="Eliminar"
                      type="button"
                      onClick={() => {
                        checkDelete(
                          "¿Realmente deseas eliminar a este rol?",
                          "deleteRole(state.role.role.id),resetRole()"
                        );
                      }}
                      className="btn btn-danger"
                    />
                  </>
                )}
              </form>
              {state.role.status === STATUS_EDIT_ROLE && (
                <>
                  <label>
                    Marcar todos &nbsp;{" "}
                    <input
                      onClick={() => setcheckAllPermission(!checkAllPermission)}
                      type="checkbox"
                    />
                  </label>
                  <div className="flex flex-wrap flex-column content-permission-role">
                    <CheckboxGroup
                      name="chekPermission"
                      value={chekPermission}
                      onChange={setCheckPermission}
                    >
                      {(Checkbox) => (
                        <>
                          {permissions.elements &&
                            permissions.elements.map((permission) => {
                              return (
                                <label key={permission.id}>
                                  <Checkbox value={permission.id} />
                                  {permission.name}
                                </label>
                              );
                            })}
                        </>
                      )}
                    </CheckboxGroup>
                  </div>
                  <input
                    type="button"
                    value="Actualizar permisos"
                    onClick={() =>
                      attachPermission(chekPermission, state.role.role.id)
                    }
                    className="w-100 btn-block btn-success"
                  />
                </>
              )}
            </>
          )}
          {state.tab === TAB_PERMISSION && (
            <>
              <form onSubmit={savedataPermission}>
                <div className="form-row">
                  <div className="col-md-6 ">
                    <label>Nombre del Permiso</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre"
                      disabled={
                        state.permission.status === STATUS_SHOW_PERMISSION
                      }
                      onChange={setFieldPermission("name")}
                      value={state.permission.permission.name}
                      required
                    />
                  </div>
                  <div className="col-md-6 ">
                    <label>Descripción</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Descripción"
                      disabled={
                        state.permission.status === STATUS_SHOW_PERMISSION
                      }
                      onChange={setFieldPermission("description")}
                      value={state.permission.permission.description}
                      required
                    />
                  </div>
                </div>

                <br></br>
                {state.permission.status === STATUS_NEW_PERMISSION && (
                  <input
                    value="Crear Permiso"
                    type="submit"
                    className="btn btn-success"
                  />
                )}
                {state.permission.status === STATUS_SHOW_PERMISSION && (
                  <>
                    <input
                      value="Modo edición"
                      type="button"
                      onClick={() =>
                        setStatusPermission(STATUS_EDIT_PERMISSION)
                      }
                      className="btn btn-success"
                    />
                  </>
                )}
                {state.permission.status === STATUS_EDIT_PERMISSION && (
                  <>
                    <input
                      value="Editar permiso"
                      type="submit"
                      className="btn btn-info"
                    />
                    <input
                      value="Eliminar"
                      type="button"
                      onClick={() => {
                        checkDelete(
                          "¿Realmente deseas eliminar a este permiso?",
                          "deletePermission(state.permission.permission.id),resetPermission()"
                        );
                      }}
                      className="btn btn-danger"
                    />
                  </>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
