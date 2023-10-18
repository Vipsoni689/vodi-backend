import mongoose, { Schema, Types } from "mongoose";
const schema = mongoose.Schema;
import CategoryModel from "./Category.model";
import UserModel from "./Users.model";

const MovieModel = schema({
  name: {
    type: String,
    default: null,
  },
  category: {
    type: schema.Types.ObjectId,
    ref: CategoryModel,
    default: null,
  },
  user: {
    type: schema.Types.ObjectId,
    ref: UserModel,
    default: null,
  },

  thumbnail: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  time: {
    type: String,
    default: null,
  },
  view: {
    type: Number,
    default: null,
  },
  show: {
    type: String,
    default: null,
  },
  releasedate: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  sub_description: {
    type: String,
    default: null,
  },
  link: {
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

export default mongoose.model("Movie", MovieModel);
