import express from "express";
import CommentModel from "../Models/Comment.model";

export const addComment = (req, res) => {
  try {
    const { userid, comments } = req.body;
    const newcomment = new CommentModel({
      userid: userid,
      comments: comments,
    });
    newcomment.save();
    if (newcomment) {
      return res.status(200).json({
        data: newcomment,
        message: "Comment added successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getComment = async (req, res) => {
  try {
    const getComment = await CommentModel.find().populate("userid");
    if (getComment) {
      return res.status(200).json({
        data: getComment,
        message: "fetch data successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
