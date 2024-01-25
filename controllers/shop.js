const Product = require("../models/product");
//trang products
exports.getProducts = (req, res, next) => {
  const isLoggedIn = req.session.user ? true : false;
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "api/v1/admin/products",
        isLoggedIn: isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

//trang shop
exports.getIndex = (req, res, next) => {
  const isLoggedIn = req.session.user ? true : false;
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isLoggedIn: isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
