import fs from "fs";

export class ProductManager {
  constructor() {
    this.path = "./database/products.json";
  }
  // Get all products
  async getProducts() {
    try {
      // Get all the products from the file
      const productsJSON = await fs.promises.readFile(this.path, "utf-8");

      // Parse the JSON
      const products = await JSON.parse(productsJSON);
      return products;
    } catch (error) {
      return [];
    }
  }
  // Get product by ID
  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);

    if (product) return product;

    throw new Error("The product doesn't exist");
  }
  // Add new Product
  async addProduct(product) {
    // Get all products
    const products = await this.getProducts();

    // Check that the product has all the fields
    const fields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "category",
    ];
    const fields_product = Object.keys(product);
    const fieldsConfirm = fields.every((field) =>
      fields_product.includes(field)
    );

    if (!fieldsConfirm) throw new Error("A field is missing from the product.");

    // Check that the code field is not repeated
    const productAdd = products.find((p) => p.code === product.code);

    // If the product does not exist, it is added to the array
    if (!productAdd) {
      product.id = products.length + 1;
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return console.log("Product added successfully");
    }

    throw new Error("There is already a product with that code.");
  }
  // Update a product
  async updateProduct(id, updatedProduct) {
    // Get all products
    const products = await this.getProducts();

    // Find the index of the product with the given ID
    const index = products.findIndex((product) => product.id === id);

    // If the product with the given ID is not found, return an error
    if (index === -1) throw new Error("Product not found.");

    // Update the product fields with the new values
    products[index] = { ...products[index], ...updatedProduct };

    // Write the updated array back to the file
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    return console.log("Product updated successfully.");
  }
  // Delete a product
  async deleteProduct(id) {
    // Get all products
    const products = await this.getProducts();

    // Find the index of the product with the ID
    const index = products.findIndex((product) => product.id === id);

    // If the product with the ID is not found, return an error
    if (index === -1) throw new Error("Product not found.");

    // Remove the product from the array
    products.splice(index, 1);

    // Write the updated array back to the file
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    return console.log("Product deleted successfully.");
  }  
}
