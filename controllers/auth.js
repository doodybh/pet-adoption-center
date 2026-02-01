const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.render("auth/sign-up.ejs", {
      error: "Username already taken.",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.render("auth/sign-up.ejs", {
      error: "Password and Confirm Password must match.",
    });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res.redirect("/auth/sign-in");
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.render("auth/sign-in.ejs", {
      error: "Invalid username or password.",
    });
  }

  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password,
  );
  if (!validPassword) {
    return res.render("auth/sign-in.ejs", {
      error: "Wrong username or password.",
    });
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  res.redirect("/");
});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
