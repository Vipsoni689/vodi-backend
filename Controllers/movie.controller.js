import MovieModel from "../Models/movie.model";
import multer from "multer";
import path from "path";
import fs from "fs";

// ********multer****************
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/Movie")) {
      cb(null, "./uploads/Movie");
    } else {
      fs.mkdirSync("./uploads/Movie");
      cb(null, "./uploads/Movie", true);
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

// ******************ADD-Movie***************
export const ADD_Movie = (req, res) => {
  try {
    const uploadFile = upload.single("thumbnail");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const {
        name,
        description,
        thumbnail,
        category,
        type,
        time,
        view,
        show,
        releasedate,
        sub_description,
        link,
        user,
      } = req.body;

      let img = "";
      if (req.file !== undefined) {
        img = req.file.filename;
      }
      console.log(img);
      const movie_data = new MovieModel({
        name: name,
        description: description,
        category: category,
        type: type,
        time: time,
        view: view,
        show: show,
        releasedate: releasedate,
        link: link,
        sub_description: sub_description,
        thumbnail: img,
        user: user,
      });
      movie_data.save();
      if (movie_data) {
        res.status(201).json({
          data: movie_data,
          message: "data add succesfully",
          path: process.env.BASE_URL + "/uploads/Movie/",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMovies = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1;
    // const pageSize = parseInt(req.query.pageSize) || 10;

    // const totalCount = await MovieModel.countDocuments();
    // const totalPages = Math.ceil(totalCount / pageSize);

    const movie_data = await MovieModel.find()
      // .skip((page - 1) * pageSize)
      // .limit(pageSize)
      .populate("category")
      .populate("user");
    if (movie_data) {
      return res.status(200).json({
        data: movie_data,
        message: "data add succesfully",
        path:"https://vodi-backend.onrender.com/uploads/Movie/",
        // pagination: {
        //   page,
        //   pageSize,
        //   totalCount,
        //   totalPages,
        // },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getsingleMovies = async (req, res) => {
  try {
    const movie_id = req.params.movie_ID;
    const movie_data = await MovieModel.findOne({ _id: movie_id })
      .populate("category")
      .populate("user");
    if (movie_data) {
      return res.status(200).json({
        data: movie_data,
        message: "data add succesfully",
        path: process.env.BASE_URL + "/uploads/Movie/",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// ******************UPDATE-Category************
export const updateMovies = async (req, res) => {
  try {
    const uploadFile = upload.single("thumbnail");

    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const Movie_Id = req.params.movie_id;
      const {
        name,
        description,
        thumbnail,
        category,
        type,
        time,
        view,
        show,
        releasedate,
        sub_description,
        link,
        user,
      } = req.body;

      const movie_data = await MovieModel.findOne({ _id: Movie_Id });

      let img = movie_data.thumbnail;
      if (req.file !== undefined) {
        img = req.file.filename;
        if (movie_data.thumbnail !== "") {
          if (fs.existsSync("./uploads/Movie/" + movie_data.thumbnail)) {
            fs.unlinkSync("./uploads/Movie/" + movie_data.thumbnail);
          }
        }
      }

      const movie = await MovieModel.updateOne(
        { _id: Movie_Id },
        {
          $set: {
            name: name,
            description: description,
            category: category,
            type: type,
            time: time,
            view: view,
            show: show,
            releasedate: releasedate,
            link: link,
            sub_description: sub_description,
            thumbnail: img,
            user: user,
          },
        }
      );
      if (movie.acknowledged) {
        return res.status(201).json({
          data: movie,
          message: "data upadate successfully",
          path: process.env.BASE_URL + "/uploads/Movie/",
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
export const deletemovie = async (req, res) => {
  try {
    const Movie_Id = req.params.movie_id;

    const findMovie = await MovieModel.findOne({ _id: Movie_Id });
    if (findMovie.thumbnail !== "") {
      if (fs.existsSync("./uploads/Movie/" + findMovie.thumbnail)) {
        fs.unlinkSync("./uploads/Movie/" + findMovie.thumbnail);
      }
    }

    const movie_data = await MovieModel.deleteOne({ _id: Movie_Id });

    if (movie_data.acknowledged) {
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

export const addview = async (req, res) => {
  try {
    const Movie_Id = req.params.movie_id;
    const { view } = req.body;

    const movie_data = await MovieModel.findOne({ _id: Movie_Id });
    let updateview;
    if (movie_data) {
      updateview = movie_data.view + 1;
    }

    const movie = await MovieModel.updateOne(
      { _id: Movie_Id },
      {
        $set: { view: updateview },
      }
    );
    if (movie.acknowledged) {
      return res.status(200).json({
        data: movie,
        message: "view upadate successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
