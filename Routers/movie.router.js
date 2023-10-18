import express from "express";
import {
  ADD_Movie,
  addview,
  deletemovie,
  getMovies,
  getsingleMovies,
  updateMovies,
} from "../Controllers/movie.controller";
const router = express.Router();

router.post("/add_movie", ADD_Movie);
router.get("/get_movie", getMovies);
router.get("/get_single_movie/:movie_ID", getsingleMovies);
router.put("/update_movie/:movie_id", updateMovies);
router.delete("/delete_movie/:movie_id", deletemovie);
router.put("/add_view/:movie_id", addview);
export default router;
