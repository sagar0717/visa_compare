/*
** To perform the CRUD operations on Countries table using countries API end point
*/
import http from "./httpService";

const apiEndPoint = `/countries`;

export function setCountry(userData) {
  return http
    .post(apiEndPoint, userData)
    .then((window.location = "/admin/countries"));
}

export function updateCountry(userData, countryId) {
  return http
    .put(`${apiEndPoint}/${countryId}`, userData)
    .then((window.location = "/admin/countries"));
}

export function deleteCountries(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}

export function getCountries() {
  return http.get(apiEndPoint);
}
