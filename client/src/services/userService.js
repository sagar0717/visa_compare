/*
** To perform the CRUD operations on Applicants table using applicants API end point
*/

import http from "./httpService";
// import config from "../config.json";

// const apiEndPoint = `${config.apiEndPoint}/applicants`;

const apiEndPoint = `/applicants`;

export async function register(applicant) {
  return http.post(apiEndPoint, {
    userName: applicant.name,
    email: applicant.username,
    password: applicant.password
  });
}

export async function getUser(applicant) {
  return http.get(apiEndPoint + "/" + applicant);
}

export async function updateUser(applicant) {
  return http.put(apiEndPoint, {
    userName: applicant.name,
    email: applicant.email,
    _id: applicant._id
  });
}

export function getUsers() {
  return http.get(apiEndPoint);
}

export function deleteUser(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}
