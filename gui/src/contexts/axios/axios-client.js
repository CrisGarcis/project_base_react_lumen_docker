import axios from "axios";

export let createClient = () => {
  let token = "";
  let plant = "";

  if (localStorage) {
    token = localStorage.getItem("token") || "";
    plant = localStorage.getItem("plant_id") || "";

  }

  return axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
    headers: {
      Authorization: token,
      Plant:plant

    }
  });
};

export default createClient;
