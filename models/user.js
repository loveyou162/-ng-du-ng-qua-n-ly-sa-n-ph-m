const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.addToCart = function (product) {
  //   Tìm kiếm sản phẩm trong giỏ hàng theo productId
  const cartProductIndex = this.cart.items.findIndex((item) => {
    return item.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  // Sao chép mảng items từ giỏ hàng để tránh thay đổi trực tiếp giỏ hàng
  const updateCartItems = [...this.cart.items];
  console.log("38 updateCartItems: ", updateCartItems);
  // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updateCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới vào mảng items
    updateCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updateCart = {
    items: updateCartItems,
  };
  this.cart = updateCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  //dùng filter lấy lại 1 mảng các sản phẩm khác với id cần xóa
  const updatedCartItem = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  this.cart.items = updatedCartItem;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
