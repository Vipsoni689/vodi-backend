import CategoryModel from "../Models/Category.model";
import multer from "multer";
import path from "path";
import fs from "fs";

//********multer****************
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/category")) {
      cb(null, "./uploads/category");
    } else {
      fs.mkdirSync("./uploads/category");
      cb(null, "./uploads/category", true);
    }
  },
  filename: function (req, file, cb) {
    // console.log(file);
    const imgName = file.originalname;
    const imgArr = imgName.split(".");
    imgArr.pop();
    const imgExt = path.extname(imgName);
    const fname = imgArr.join(".") + "-" + Date.now() + imgExt;
    // console.log(fname);
    cb(null, fname);
  },
});
const upload = multer({ storage: storage });

//******************ADD-Category***************

export const ADD_category = (req, res) => {
  try {
    const uploadFile = upload.single("image");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const { name, description, Image } = req.body;

      let img = "";
      if (req.file !== undefined) {
        img = req.file.filename;
      }
      console.log(img);
      const category_data = new CategoryModel({
        name: name,
        description: description,
        image: img,
      });
      category_data.save();
      if (category_data) {
        res.status(201).json({
          data: category_data,
          message: "data add succesfully",
          // path: process.env.BASE_URL + process.env.PORT + "/uploads/category/",
          path: process.env.BASE_URL + "/uploads/category/",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// ******************get-Category***************
export const getCategory = async (req, res) => {
  try {
    const category_data = await CategoryModel.find();
    if (category_data) {
      return res.status(200).json({
        data: category_data,
        message: "data add succesfully",
        path: process.env.BASE_URL + "/uploads/category/",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ******************UPDATE-Category************
export const updatecategory = async (req, res) => {
  try {
    const uploadFile = upload.single("image");

    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const category_Id = req.params.category_id;
      const { name, description } = req.body;

      const category = await CategoryModel.findOne({ _id: category_Id });

      let image = category.image;
      if (req.file !== undefined) {
        image = req.file.filename;
        if (category.image !== "") {
          if (fs.existsSync("./uploads/category/" + category.image)) {
            fs.unlinkSync("./uploads/category/" + category.image);
          }
        }
      }

      const category_data = await CategoryModel.updateOne(
        { _id: category_Id },
        {
          $set: {
            name: name,
            description: description,
            image: image,
          },
        }
      );
      if (category_data.acknowledged) {
        return res.status(201).json({
          data: category_data,
          message: "data upadate successfully",
          path: process.env.BASE_URL + "/uploads/category/",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// *****************delete-category*********************
export const delete_category = async (req, res) => {
  try {
    const category_ID = req.params.category_id;

    const findCategory = await CategoryModel.findOne({ _id: category_ID });
    if (findCategory.image !== "") {
      if (fs.existsSync("./uploads/category/" + findCategory.image)) {
        fs.unlinkSync("./uploads/category/" + findCategory.image);
      }
    }

    const category_data = await CategoryModel.deleteOne({ _id: category_ID });

    if (category_data.acknowledged) {
      return res.status(200).json({
        message: "data delete successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
