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
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      // Kiểm tra xem đã tồn tại người dùng với email này chưa
      return User.findOne({ email: email }).then((existingUser) => {
        if (existingUser) {
          // Nếu tồn tại người dùng, đưa ra thông báo lỗi và quay lại trang đăng ký
          res.send("Email đã được sử dụng!");
        } else {
          // Nếu chưa tồn tại người dùng, tạo mới người dùng và lưu vào cơ sở dữ liệu
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
          });

          return user.save();
        }
      });
    })
    .then((result) => {
      // Nếu người dùng đã được tạo thành công, chuyển hướng đến trang đăng nhập
      console.log(result);
      console.log("Tạo người dùng thành công!");
      res.redirect("/login");
    })
    .catch((err) => {
      // Xử lý lỗi
      console.log(err.message);
      res.redirect("/signup"); // Chuyển hướng trở lại trang đăng ký nếu có lỗi
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
exports.getAllUser = (req, res) => {
  User.find()
    .then((user) => {
      console.log(user);
      return user;
    })
    .then((result) => {
      res.json(result);
    });
};
