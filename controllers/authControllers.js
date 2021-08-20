const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

const createToken = id => {
  return jwt.sign({ id }, "secret");
};

// NOTEHANDLE ERROR
function handleErrors(err) {
  let errors = { email: "", password: "" };
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  if (err.message.includes("Invalid password")) {
    errors.password = "Invalid password";
  }

  if (err.message.includes("User does not exists")) {
    errors.email = "User does not exists";
  }

  if (err.message.includes("Authentication failed")) {
    errors.email = "Authentication failed";
  }
  return errors;
}

module.exports.signup_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.render("signup");
};

module.exports.signin_get = (req, res) => {
  res.render("signin");
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 1000 * 60 * 60 });
    res.status(201).json({ user, token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.signin_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 1000 * 60 * 60 });
    res.status(200).json({ user: user.id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
