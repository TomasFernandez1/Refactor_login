import { Schema, model } from "mongoose";

const userCollection = "users";

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

export default model(userCollection, userSchema)