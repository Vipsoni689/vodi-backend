import multer from "multer";
import path from "path";
import fs from "fs";

// ********multer****************
export const multerfunctions = () => {
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
  return multer({ storage: storage });
};
