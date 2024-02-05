import passport from "passport";
import local from "passport-local";
import userManagerMongo from "../managers/userManagerMongo.js";
import { isValidPassword, createHash } from "../utils.js";
import GitHubStrategy from "passport-github2";

const uManager = new userManagerMongo();
const LocalStrategy = local.Strategy;

export const initializePassport = () => {
  // Register Strategy
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const { email } = req.body;

        try {
          // Verificar si el usuario o el correo ya existen en la base de datos
          const existingUser = await uManager.getUser({ email });
          if (existingUser) {
            return done(null, false, {
              message: "El usuario o el correo ya están registrados.",
            });
          }

          // Crear un nuevo usuario
          const hashedPassword = createHash(password);
          const newUser = { username, email, password: hashedPassword };
          const createdUser = await uManager.createUser(newUser);

          // Retornar el nuevo usuario
          return done(null, createdUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Login Strategy
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await uManager.getUser({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(password, user.password))
            return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Github Strategy to Login
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.3f971f57d13cbf05",
        clientSecret: "54bd6bbe03a2a1c0026c92481a1f05f646e545fa",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile: ", profile);
        try {
          let user = await uManager.getUser({ email: profile._json.email });
          if (!user) {
            let newUser = {
              username: profile.username,
              email: profile._json.email,
              role: "user",
              password: "",
            };

            let result = await uManager.createUser(newUser);
            return done(null, result);
          }

          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await uManager.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
