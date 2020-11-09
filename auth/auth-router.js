const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/dbConfig");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db("users").where({ username }).first();

    if (user) {
      res.status(409).json({ message: "Username already exists. " });
    }

    const passwordHash = bcrypt.hashSync(password, 14);

    const id = await db("users").insert({
      username,
      password: passwordHash,
    });

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "There was an error. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db("users").where({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        username: user.username,
      },
      "this is a very secret secret"
    );

    res.json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "yo you messed up" });
  }
});

module.exports = router;
