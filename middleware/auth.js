const jwt = require("jsonwebtoken");
const config = require("config");

// to protect the routes from un authorized access
function auth(req, res, next) {
  if (!config.get("requiresAuth")) return next();
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.applicant = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}
module.exports = auth;
