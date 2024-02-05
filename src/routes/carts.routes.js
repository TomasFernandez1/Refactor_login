import { Router } from "express";
import cartManagerMongo from "../managers/cartManagerMongo.js";

const router = Router();
const cManager = new cartManagerMongo();

router
  // Endpoint to Get the list of products from a cart using ID
  .get("/carts/:cid", async (req, res) => {
    try {
      const { cid } = req.params; // ID Cart
      const { products } = await cManager.getCart(cid);
      res.render("cart", { products, req });
    } catch (error) {
      res.status(500).send({ Message: error.message });
    }
  })

  .get("/carts", async (req, res) => {
    res.status(200).send(await cManager.getCarts());
  })

  // Endpoint to create a cart
  .post("/carts", async (req, res) => {
    try {
      await cManager.createCart();
      res.status(200).send("Cart created");
    } catch (err) {
      res.status(500).send({ Message: err.message });
    }
  })

  // Endpoint to add a product to the cart using ID cart and ID product
  .post("/carts/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cManager.getCart(cid);
      const productIndex = cart.products.findIndex(
        (p) => p.product && p.product.id === pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      const result = await cManager.updateCart(cid, cart);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ Message: error.message });
    }
  })

  // Endpoint to update the products for the cart
  .put("carts/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const cart = await cManager.getCart(cid);
      cart.products = products;
      await cManager.updateCart(cid, cart);
      res.status(200).send({ Message: "Cart was updated successfully" });
    } catch (error) {
      res.status(500).send({ Message: error.message });
    }
  })

  //  Endpoint to update the quantity of a product
  .put("/carts/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await cManager.updateQuantityProductCart(
        cid,
        pid,
        quantity
      );

      res
        .status(200)
        .send({ Message: "The quantity was updated successfully" });
    } catch (error) {
      res.status(500).send({ Message: error.message });
    }
  })

  // Endpoint to remove a product from the cart
  .delete("/carts/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const result = await cManager.deleteProductCart(cid, pid);
      res
        .status(200)
        .send({ Message: "The product were deleted successfully" });
    } catch (error) {
      res.status(500).send({ Message: error.message });
    }
  })

  // Endpoint to delete all products from a cart
  .delete("/carts/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const result = await cManager.deleteProductsCart(cid);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ Message: error.message });
    }
  });

export default router;
