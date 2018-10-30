const config = require("config");
const dbDebuger = require("debug")("app:db");
const express = require("express");
const dbConnection = require("./dbConnection");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;

const applicationRoutes = require("./api/routes/applications");
const userRoutes = require("./api/routes/applicants");
const authRouters = require("./api/routes/auth");
const visaTypeRouters = require("./api/routes/visatypes");
const countryRouters = require("./api/routes/countries");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(express.json()); //body request parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Handling CORS error
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res
    .header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept,Authorization, x-auth-token"
    )
    .header("Access-Control-Expose-Headers", "Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATH");
    return res.status(200).json({});
  }
  next();
});
app.use("/average/waiting/days", applicationRoutes);
// app.use("/average/waiting/visa_decision", applicationRoutes);
// app.use("/average/waiting/case_officer", applicationRoutes);
// app.use("/average/waiting/medical", applicationRoutes);
app.use("/per/countries", applicationRoutes);
app.use("/applications", applicationRoutes);
app.use("/applicants", userRoutes);
app.use("/auth", authRouters);
app.use("/visatypes", visaTypeRouters);
app.use("/countries", countryRouters);
// To handel not existing routing errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// To handel other errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
// app.listen(port, () => dbDebuger(`Server started on port ${port}`));
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { app };
