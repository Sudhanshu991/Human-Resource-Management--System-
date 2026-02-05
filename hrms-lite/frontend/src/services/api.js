import axios from "axios";

const API = axios.create({
  baseURL: "https://human-resource-management-system-1-5tfm.onrender.com",
});

export default API;
