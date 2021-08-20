const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = async (req, res, next) => {
  console.log("IN AUTH");
  const token = req.cookies.jwt;
  if (token) {
    const decoded = jwt.verify(token, "secret");
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      console.log("NOT AUTH");
      res.redirect("/signin");
    } else {
      next();
    }
  } else {
    res.redirect("/signin");
  }
};
//CHECK USER
// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secret", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
