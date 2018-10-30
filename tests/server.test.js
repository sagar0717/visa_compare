const expect = require("expect"); // expect for assertion
const request = require("supertest"); // for testing our expression test routes
const { ObjectID } = require("mongodb"); // mocha for entire test suite
const { app } = require("../server");

describe("GET /applications", () => {
  it("should get all the applications", done => {
    request(app)
      .get("/applications")
      .expect(200)
      .end(done);
  });
});
