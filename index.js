import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import UserRouter from "./Routers/Users.router";
import CategoryRouter from "./Routers/Category.router";
import MovieRouter from "./Routers/movie.router";
import Playlist from "./Routers/Playlist.router";
import CommentRouter from "./Routers/Comment.router";

const app = express();

app.use(express.json());
app.use(express.static(__dirname));
app.use(cors());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  // console.log(`http://localhost:8001`);
});

// mongoose
//   .connect("mongodb://127.0.0.1:27017/VODI")
//   .then(() => {
//     console.log("database connected");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
async function mauin() {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
}
mauin();
app.use(UserRouter);
app.use(CategoryRouter);
app.use(MovieRouter);
app.use(Playlist);
app.use(CommentRouter);
