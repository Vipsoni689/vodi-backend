import Playlist from "../Models/Playlist.model";
import MovieModel from "../Models/movie.model";

export const addplaylist = async (req, res) => {
  try {
    const { UserId, Movieid } = req.body;

    const Playlistitem = await Playlist.findOne({
      UserId: UserId,
      Movieid: Movieid,
    });

    if (Playlistitem) {
      return res.status(400).json({
        message: "allready added to playlist",
      });
    } else {
      const movie = await MovieModel.findOne({ _id: Movieid });
      //   console.log(movie);
      const playlist_data = new Playlist({
        UserId: UserId,
        Movieid: Movieid,
        name: movie.name,
        type: movie.type,
        thumbnail: movie.thumbnail,
        show: movie.show,
        releasedate: movie.releasedate,
        time: movie.time,
      });
      playlist_data.save();
      if (playlist_data) {
        return res.status(200).json({
          data: playlist_data,
          message: "playlist saved successfully",
          path: process.env.BASE_URL + "/uploads/Movie/",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const get_playlist = async (req, res) => {
  try {
    const Playlistdata = await Playlist.find()
      .populate("UserId")
      .populate("Movieid");
    if (Playlistdata) {
      return res.status(200).json({
        data: Playlistdata,
        message: "fetch data from Playlist successfully",
        path: process.env.BASE_URL + "/uploads/Movie/",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const delete_playlist = async (req, res) => {
  try {
    const playlist_Id = req.params.playlist_id;
    const deletedItem = await Playlist.deleteOne({ _id: playlist_Id });
    if (deletedItem.acknowledged) {
      return res.status(200).json({
        message: "Deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
