import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/images`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploader = multer({ storage });

export const createHash = (passw) =>
  bcrypt.hashSync(passw, bcrypt.genSaltSync(10));

export const isValidPassword = (passw, passwordUser) =>
  bcrypt.compareSync(passw, passwordUser);
