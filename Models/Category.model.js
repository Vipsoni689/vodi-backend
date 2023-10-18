import mongoose from "mongoose";
const schema = mongoose.Schema;
const CategoryModel = new schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  description:{
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

export default mongoose.model("category", CategoryModel);
