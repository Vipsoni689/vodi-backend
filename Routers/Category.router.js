import express from "express";
import {
  ADD_category,
  delete_category,
  getCategory,
  updatecategory,
} from "../Controllers/Category.controller";

const router = express.Router();

router.post("/add_category", ADD_category);
router.get("/get_category", getCategory);
router.put("/update_category/:category_id", updatecategory);
router.delete("/delete_category/:category_id", delete_category);

export default router;
