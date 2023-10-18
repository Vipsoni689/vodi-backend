import mongoose from "mongoose";
import UserModel from "./Users.model";
const schema = mongoose.Schema;

const CommentModel = schema({
  userid: {
    type: schema.Types.ObjectId,
    ref: UserModel,
    default: null,
  },
  comments: {
    type: String,
    required: true,
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

export default mongoose.model("comment", CommentModel);
