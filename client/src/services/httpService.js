/*
** To configue frontend with backend services
*/

import axios from "axios";

// import config from "../config.json";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status <= 500;
  if (!expectedError) {
    toast.error(`An unexpected error occurred. Please try again later`);
  }

  return Promise.reject(error);
});
// Send jwt with request
function setJwt(jwt) {
  let instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL //config.apiEndPoint
  });
  instance.defaults.headers.common["x-auth-token"] = jwt;
}
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};
