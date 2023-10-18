import mongoose from "mongoose";
const schema = mongoose.Schema;
const UserModel = new schema({
  name: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("user", UserModel);
