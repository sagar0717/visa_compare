const { isApplicantOntrack } = require("../api/models/application");

test("Is applicant's visa process time on track", () => {
  const applicant = {
    applicationDate: new Date("2018, 7, 9")
  };
  const averageWaitingPeriod = 200;
  expect(isApplicantOntrack(applicant, averageWaitingPeriod)).toBe(true);
});
