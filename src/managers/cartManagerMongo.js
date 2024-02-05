import cartModel from "../models/carts.models.js";

export default class cartManagerMongo {
  constructor() {}

  async getCarts() {
    return await cartModel.find().lean();
  }

  async getCart(id) {
    return await cartModel.findById({ _id: id });
  }

  async createCart() {
    return await cartModel.create({ products: [] });
  }

  async updateCart(id, newCart) {
    return await cartModel.findByIdAndUpdate(id, newCart);
  }

  async deleteCart(id) {
    return await cartModel.findByIdAndUpdate({ _id: id });
  }

  async deleteProductCart(cid, pid) {
    return await cartModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
  }

  async updateQuantityProductCart(cid, pid, quantity) {
    const cart = await this.getCart(cid);
    const productIndex = cart.products.findIndex(
      (p) => p.product && p.product.id === pid
    );

    cart.products[productIndex].quantity = quantity;

    return await this.updateCart(cid, cart)
  }

  async deleteProductsCart(cid){
    return await cartModel.updateOne({_id: cid}, { $set : {'products': []}})
  }
}
