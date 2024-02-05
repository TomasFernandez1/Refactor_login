import { Router } from "express";
import userManager from "../managers/userManagerMongo.js";
import { isValidPassword, createHash } from "../utils.js";
import passport from "passport";

const uManager = new userManager();
const router = Router();

router

  // Endpoint Login view
  .get("/login", (req, res) => {
    res.render("login", req);
  })

  .get("/faillogin", async (req, res) => {
    res.send({ error: "falla en el login" });
  })
  // Endpoint to Login
  .post(
    "/login",
    passport.authenticate("login", {
      failureRedirect: "/api/sessions/faillogin",
    }),
    async (req, res) => {
      if (!req.user)
        return res
          .status(401)
          .send({ status: "ERROR", error: "Invalid credentials" });

      req.session.user = {
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        id: req.user._id,
      };

      res.redirect("/api/products");
    }
  )
  // Endpoint Register view
  .get("/register", (req, res) => {
    res.render("register", req);
  })

  // Endpoint failRegister
  .get("/failregister", (req, res) => {
    res.send({ Status: "Error", message: "Register failed" });
  })

  // Endpoint to register
  .post(
    "/register",
    passport.authenticate("register", {
      successRedirect: "/api/sessions/login",
      failureRedirect: "/api/sessions/failregister",
    })
  )

  // Endpoint Recovery-password view
  .get("/recovery-password", (req, res) => {
    res.render("recovery-password", req);
  })

  // Ednpoint to recover the password
  .post("/recovery-password", async (req, res) => {
    try {
      const { email, passw } = req.body;
      const newPassword = createHash(passw);
      const user = await uManager.getUser({ email });
      user.password = newPassword;
      await uManager.updateUser(user._id, user);
      res.status(200).redirect("/api/sessions/login");
    } catch (error) {
      res.status(500).send({
        Status: "Error",
        Code: 500,
        Error: error.message,
      });
    }
  })

  // Endpoint GitHub Auth view
  .get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
  )

  // Endpoint login with GitHub
  .get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/api/sessions/login" }),
    async (req, res) => {
      req.session.user = req.user;
      res.redirect("/api/products");
    }
  )

  // Endpoint to Logout
  .post("/logout", (req, res) => {
    req.session.destroy();
    res.status(204).redirect("/api/sessions/login");
  });

export default router;
