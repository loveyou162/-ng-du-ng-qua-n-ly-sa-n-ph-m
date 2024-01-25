const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = require("../routes/admin");

exports.getLogin = (req, res, next) => {
  res.render("login/login", {
    pageTitle: "Login",
    path: "/login",
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(400).send("Cannot find user");
      }
      console.log(user.password);
      if (!req.body.password) {
        return res.status(400).send("Password is required");
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (result) {
            req.session.user = {
              userId: user._id,
              email: user.email,
            };
            console.log("User is logged in!");
            res.redirect("/api/v1/products");
          } else {
            res.send("Not Allowed");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignUp = (req, res, next) => {
  res.render("login/register", {
    pageTitle: "Login",
    path: "/register",
  });
};
exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
    console.log(19, hashedPassword);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    user
      .save()
      .then((result) => {
        console.log(result);
        console.log("Create User Successfully!");
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login"); // Hoặc chuyển hướng đến trang khác
    }
  });
};
