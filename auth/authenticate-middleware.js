/*
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await db("users").where({ username }).first();

  if (!user) {
    return res.status(401).json({
      message: "Invalid username",
    });
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    res.status(401).json({
      message: "Invalid password",
    });
  }

  req.user = user;

  next();
};
