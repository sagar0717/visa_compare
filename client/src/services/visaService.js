/*
** To perform the CRUD operations on Applications table using applicants API end point
*/

import http from "./httpService";
// import config from "../config.json";

// const apiEndPoint = `${config.apiEndPoint}/applications/`;

const apiEndPoint = `/applications/`;

export function setVisaDetail(application) {
  return http.post(apiEndPoint, {
    visaSubclass: application.visaSubclass,
    visaLodgementDate: application.visaLodgementDate,
    country: application.country,
    applicantId: application.applicantId,
    caseOfficerAssigned: application.caseOfficerAssigned,
    caseOfficerAssignedOn: application.caseOfficerAssignedOn,
    MedicalCheckRequested: application.MedicalCheckRequested,
    MedicalRequestDate: application.MedicalRequestDate,
    supplementaryDocumentsRequested:
      application.supplementaryDocumentsRequested,
    supplementaryDocsRequestDate: application.supplementaryDocsRequestDate,
    visaStatus: application.visaStatus,
    visaDecisionDate: application.visaDecisionDate
  });
}

export function getVisaDetail(id) {
  return http.get(`${apiEndPoint}${id}`);
}

export function getApplications() {
  return http.get(apiEndPoint);
}

//get top 10 countries visa applications counts
export function getApplicationsPerCountries() {
  return http.get(`${apiEndPoint}per/countries`);
}

export function getVisaStatus() {
  return [
    { Id: 1, status: "Approved" },
    { Id: 2, status: "Rejected" },
    { Id: 3, status: "Pending" }
  ];
}

export function deletApplication(id) {
  return http.delete(`${apiEndPoint}${id}`);
}
// get applicants already waited period from lodgement date against all milestone
export function getApplicantStats(id) {
  return http.get(`${apiEndPoint}average/waiting/${id}`);
}

/*
  get average waiting period from the lodgment date based on country and visa subclass
  grouped by country.
*/
export function getAverageStats(country, visaSubclass) {
  return http.get(
    `${apiEndPoint}average/waiting/days/${country}/${visaSubclass}`
  );
}
