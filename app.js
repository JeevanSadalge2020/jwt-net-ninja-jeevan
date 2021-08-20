const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine
app.set("view engine", "ejs");
app.use(cookieParser());

// database connection
const dbURI =
  "mongodb+srv://jeevan-jwt-net-ninja:jeevanJwtNetNinja@cluster-jeevan-sadalge.wmn3f.mongodb.net/node-auth";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(_ => app.listen(3000))
  .catch(err => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", requireAuth, (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
