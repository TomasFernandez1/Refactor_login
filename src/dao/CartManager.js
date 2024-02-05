import fs from "fs";

export class cartManager {
  constructor() {
    this.path = "./database/carts.json";
  }

  async getCarts() {
    try {
      // Get all the carts from the file
      const cartsJSON = await fs.promises.readFile(this.path, "utf-8");

      // Parse the JSON
      const carts = await JSON.parse(cartsJSON);
      return carts;
    } catch (error) {
      throw new Error("There isnt a file with that name");
    }
  }

  async newCart(newCart) {
    const carts = await this.getCarts(); // Get all the carts
    newCart.id = carts.length + 1; // Add an ID to the new cart
    carts.push(newCart); // Add the new cart to the cart list
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
  }
  
  async getCartById(id) {
    const carts = await this.getCarts(); // Get all the carts
    const cart = carts.find((c) => c.id === id); // Find the cart using an ID

    if (cart) return cart;

    throw new Error("The cart doesn't exist");
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts(); // Get all the carts
      const cartIndex = carts.findIndex(c => c.id === cid); // Find the index of the cart using an ID

      if (cartIndex !== -1) {
        const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid); // Find the index of the product using a product ID
        if(productIndex !== -1) {
          carts[cartIndex].products[productIndex].quantity++ // Increment the quantity of the product if the product exists
        }else{
          carts[cartIndex].products.push({product: pid, quantity:+1}) // Create the new product and increment the quantity
        }
        
        
    }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return console.log("Product added to cart successfully.");
    } catch (error) {
      return console.log(error);
    }
  }
  
  
}
