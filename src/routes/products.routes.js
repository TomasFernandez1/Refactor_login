import { Router } from "express";
import productManagerMongo from "../managers/productManagerMongo.js";

const router = Router();
const pManager = new productManagerMongo();

router
  // Endpoint get all products
  .get("/products", async (req, res) => {
    try {
      const { limit = 10, pageQuery = 1, sort, query } = req.query;

      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
        await pManager.getProducts(limit, pageQuery, sort, query);

      res.render("products", {
        products: docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page,
        req
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  })

  // Endpoint to get a product by ID
  .get("/products/:pid", async (req, res) => {
    try {
      const { pid } = req.params; // Product ID
      const result = await pManager.getProduct(pid);
      return res.send(result);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  })

  // Endpoint to create a new Product
  .post("/products", async (req, res) => {
    try {
      const newProduct = req.body; // New Product

      const result = await pManager.createProduct(newProduct);
      return res.send(result);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  })

  // Endpoint to update a Product
  .put("/products/:pid", async (req, res) => {
    try {
      const { pid } = req.params; // Product ID
      const updateProduct = req.body; // Updated product
      await pManager.updateProduct(pid, updateProduct);
      res.send({
        message: `The Product with id ${pid} was successfully updated`,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })

  // Endpoint to delete a Product
  .delete("/products/:pid", async (req, res) => {
    try {
      const { pid } = req.params; // Product ID
      await pManager.deleteProduct(pid);
      res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

export default router;
