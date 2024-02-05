// Libraries
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

// Config
import { __dirname } from "./utils.js";
import { connectDB } from "./config/config.js";
import { initializePassport } from "./config/passport.config.js";

// Routes & Sockets
import productsRoute from "./routes/products.routes.js";
import cartsRoute from "./routes/carts.routes.js";
//import pruebasRoute from "./routes/pruebas.routes.js";
import sessionRoute from "./routes/sessions.routes.js";
import chatRoute, { chatSocket } from "./routes/chat.routes.js";
import { auth } from "./middlewares/auth.middleware.js";

// Create Express and ProductManager instances
const app = express();

// Configuration of the server
connectDB();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cookieParser("secretWord"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://tomasAdmin:0QyJ3SSkPBqPmLpC@cluster-coderhouse.bg10jwi.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
  })
);


// Init passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Configuration of views
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Endpoints
app.get("/", (req, res) => {
  res.redirect("/api/sessions/login");
});
app.use("/api/sessions", sessionRoute);
app.use("/api", auth, productsRoute);
app.use("/api", auth, cartsRoute);
//app.use('/pruebas', pruebasRoute);
app.use(chatRoute);

// Create server on port 8080
const httpServer = app.listen(8080, () => {
  console.log("Listening port 8080");
});

// Create webSocket
export const io = new Server(httpServer);

// Sockets
chatSocket();
