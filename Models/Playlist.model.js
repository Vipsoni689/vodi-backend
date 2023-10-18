import mongoose from "mongoose";
import UserModel from "./Users.model";
import MovieModel from "./movie.model";

const schema = mongoose.Schema;

const Playlist = new schema({
  UserId: {
    type: schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  Movieid: {
    type: schema.Types.ObjectId,
    ref: MovieModel,
    required: true,
  },
  name: {
    type: String,
    default: null,
  },
  time: {
    type: String,
    default: null,
  },
  show: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  releasedate: {
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

export default mongoose.model("Playlist", Playlist);
