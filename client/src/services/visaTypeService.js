/*
** To perform the CRUD operations on visatype table using applicants API end point
*/

import http from "./httpService";
// import config from "../config.json";

// const apiEndPoint = `${config.apiEndPoint}/visatypes`;

const apiEndPoint = `/visatypes`;

export function setVisaType(userData) {
  if (userData._id) {
    const body = { ...userData };
    delete body._id;
    return http
      .put(`${apiEndPoint}/${userData._id}`, userData)
      .then((window.location = "/admin/visatypes"));
  }

  return http
    .post(apiEndPoint, userData)
    .then((window.location = "/admin/visatypes"));
}

export function updateVisaType(userData, visaTypeId) {
  return http
    .put(`${apiEndPoint}/${visaTypeId}`, userData)
    .then((window.location = "/admin/visatypes"));
}

export function deleteVisaTypes(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}

export async function getVisaSubclasses() {
  const visaType = await http.get(apiEndPoint);
  let vt = [];
  visaType.data.forEach(t => {
    const { _id, visaSubClass } = t;
    vt.push({ id: _id, subclass: visaSubClass });
  });
  return vt;
}

export function getVisaTypes() {
  // const visatypes = await http.get(apiEndPoint).then(response =>
  //   response.data.map(visatype => ({
  //     id: `${visatype._id}`,
  //     visaGroup: `${visatype.visaGroup}`,
  //     visaSubClass: `${visatype.visaSubClass}`,
  //     description: `${visatype.description}`
  //   }))
  // );
  // return { visatypes };
  return http.get(apiEndPoint);
}

export function getVisaType(id) {
  return http.get(`${apiEndPoint}/${id}`);
}
