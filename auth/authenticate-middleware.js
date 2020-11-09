/*
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    jwt.verify(token, "this is a very secret secret", (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Can't decode - Invalid credentials",
        });
      }

      // make the token's decoded payload available to other middleware
      // functions or route handlers, in case we want to use it for something
      req.token = decoded;
      // at this point, we know the token is valid and the user is authorized
      next();
    });
  } catch (err) {
    next(err);
  }
};
