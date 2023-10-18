import express from "express";
import { addComment, getComment } from "../Controllers/Comment.controller";

const router = express.Router();

router.post("/addComment", addComment);
router.get("/getComment", getComment);

export default router;
