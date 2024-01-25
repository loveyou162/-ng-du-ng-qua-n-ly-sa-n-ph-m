const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const errorController = require("./controllers/error");
const User = require("./models/user");
const app = express();
// app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const loginRoutes = require("./routes/login");

app.use(
  session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // Kiểm tra xem có người dùng đã đăng nhập không (có lưu thông tin trong session không)
  if (!req.session || !req.session.user || !req.session.user.userId) {
    return next(); // Không có người dùng, chuyển đến middleware tiếp theo
  }
  User.findById(req.session.user.userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use((req, res, next) => {
  // Thiết lập biến isLoggedIn dựa trên trạng thái đăng nhập
  res.locals.isLoggedIn = req.session.user ? true : false;
  next();
});
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", shopRoutes);
app.use(loginRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://caoboi520:Aw8umOX1tKDxMVsg@cluster0.fdehoqk.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
