import productModel from "../models/products.models.js";

export default class productManagerMongo {
  constructor() {}

  async getProducts(limit, page, sort, query) {
    if (!sort) {
      return await productModel.paginate({}, { limit, page, lean: true });
    } else {
      return await productModel.paginate(
        {},
        { limit, page, lean: true, sort: { price: sort } }
      );
    }
  }

  async getProduct(id) {
    return await productModel.findById({ _id: id });
  }

  async createProduct(newProduct) {
    return await productModel.create(newProduct);
  }

  async updateProduct(id, newProduct) {
    return await productModel.findByIdAndUpdate({_id: id}, newProduct);
  }

  async deleteProduct(id) {
    return await productModel.findByIdAndDelete({ _id: id });
  }
}
