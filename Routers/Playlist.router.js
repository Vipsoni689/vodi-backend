import express from "express";
import { addplaylist, delete_playlist, get_playlist } from "../Controllers/Playlist.controller";

const router = express.Router();

router.post("/add-playlist", addplaylist);
router.get("/get-playlist", get_playlist);
router.delete("/delete/:playlist_id", delete_playlist);
export default router;
