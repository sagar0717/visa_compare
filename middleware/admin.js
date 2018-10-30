const config = require("config");

//to verify the type of user i.e whether Admin or not
function admin(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  console.log(req);
  if (!config.get("requiresAuth")) return next();

  if (!req.applicant.isAdmin) return res.status(403).send("Access denied.");

  next();
}

module.exports = admin;
