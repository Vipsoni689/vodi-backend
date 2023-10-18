import UserModel from "../Models/Users.model";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
const nodemailer = require("nodemailer");
import jwt from "jsonwebtoken";

// ********multer****************
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/users")) {
      cb(null, "./uploads/users");
    } else {
      fs.mkdirSync("./uploads/users");
      cb(null, "./uploads/users", true);
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
// ************SIGN UP**************
export const Signup = async (req, res) => {
  try {
    const uploadFile = upload.single("avatar");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const userdata = await UserModel.findOne({
        $or: [
          { email: req.body.email },
          { username: req.body.username },
          { email: req.body.email, username: req.body.username },
        ],
      });
      if (userdata) {
        return res.status(300).json({ message: "user already exists" });
      }
      let img = "";
      if (req.file !== undefined) {
        img = req.file.filename;
      }

      const newpassword = bcrypt.hashSync(req.body.password, 10);
      const Userdata = await UserModel.create({
        ...req.body,
        password: newpassword,
        avatar: img,
      });

      return res.status(201).json({
        data: Userdata,
        message: "data add succesfully",
        path: process.env.BASE_URL + "/uploads/users/",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//  *******get users *******************
export const get_users = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      data: users,
      message: "data fetched successfully",
      // path: process.env.BASE_URL + process.env.PORT + "/uploads/users/",
      path: process.env.BASE_URL + "/uploads/users/",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// ****SIGN IN WITH PASSWORD***********
export const Signin = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    console.log(req.body);

    let userdata;

    if (email) {
      userdata = await UserModel.findOne({ email: email });
    } else if (username) {
      userdata = await UserModel.findOne({ username: username });
    }

    if (!userdata) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    // const userdata = await UserModel.findOne({
    //   $or: [
    //     { email: email },
    //     { username: username },
    //     { email: email, username: username },
    //   ],
    // });
    // if (!userdata) {
    //   return res.status(400).json({
    //     message: "user does not exist",
    //   });
    // }

    const newpassword = bcrypt.compareSync(password, userdata.password);
    console.log(newpassword);
    if (!newpassword) {
      return res.status(400).json({
        message: "invalid credential",
      });
    }
    const token = jwt.sign(
      {
        userdata: userdata._id,
        email: userdata.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    if (newpassword) {
      return res.status(200).json({
        data: userdata,
        token: token,
        message: "login successfull",
        path: process.env.BASE_URL + "/uploads/users/",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// *************update-User**********
export const Update_User = async (req, res) => {
  try {
    const uploadFile = upload.single("avatar");

    uploadFile(req, res, async function (err) {
      const Id = req.params.user_id;
      const { name, contact, avatar, username, role, status, email } = req.body;

      const user_data = await UserModel.findOne({ _id: Id });

      let img = user_data.avatar;
      if (req.file !== undefined) {
        img = req.file.filename;
        if (user_data.avatar !== "") {
          if (fs.existsSync("./uploads/users/" + user_data.avatar)) {
            fs.unlinkSync("./uploads/users/" + user_data.avatar);
          }
        }
      }
      const update_User = await UserModel.updateOne(
        { _id: Id },
        {
          $set: {
            name: name,
            role: role,
            contact: contact,
            avatar: img,
            username: username,
            status: status,
          },
        }
      );
      if (update_User.acknowledged) {
        res.status(200).json({
          data: update_User,
          message: "update seccesfull",
          path: process.env.BASE_URL + "/uploads/users/",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ********************delete_User****************
export const delete_User = async (req, res) => {
  try {
    const User_Id = req.params.user_id;

    const userdata = await UserModel.findOne({ _id: User_Id });

    if (userdata) {
      if (fs.existsSync("/uploads/users/" + userdata.avatar)) {
        fs.unlinkSync("./uploads/users/" + userdata.avatar);
      }
    }
    const delete_Users = await UserModel.deleteOne({ _id: User_Id });
    if (delete_Users.acknowledged) {
      return res.status(200).json({
        data: delete_Users,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    const userdata = await UserModel.findOne({
      email: email,
    });

    var OTP = parseInt(Math.random() * 100000);
    console.log(OTP);
    const updateotp = await UserModel.updateOne(
      {
        email: email,
      },
      { $set: { otp: OTP } }
    );
    if (!userdata) {
      return res.status(400).json({
        message: "please sign-up ",
      });
    }
    if (updateotp) {
      res.status(200).json({
        message: "otp send on your GMAIL",
      });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: "vipulsoni689@gmail.com",
      subject: "Verify OTP with email",
      text: `${OTP}`,
      html: `<h2>Dear ${userdata.fullname}</h2>
        <p>The One Time Password (OTP) for your Registation to link gmail  is:- <b>${OTP}</b>.<br>
         This OTP is valid for 30 minutes or 1 successful attempt whichever is earlier. Please note, this OTP is valid only for this time for login and cannot be used another time.</p> 
        <p style="color:red;">Please do not share this One Time Password with anyone.</p>
        <p>To know more, refer to FAQS</p>
        <p>In case you have not requested for OTP, please contact the <b>VIPUL SONI</b> helpline:- <a href="tel:+918369039831">8369039831</a> 👍</.</p>
        <br> OTP:- <b>${OTP}</b> <br> <br> 
        <h4>Thanks and regard ! 😊😊</h4> `,
    });

    console.log("Message sent: %s", info.messageId);

    setTimeout(async () => {
      const setotp = await UserModel.updateOne(
        { email: email },
        { $set: { otp: null } }
      );
    }, 60000);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const forgatePassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const userdata = await UserModel.findOne({
      $or: [({ email: email }, { otp: otp }, { email: email, otp: otp })],
    });
    if (!userdata) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (userdata) {
      const newpassword = bcrypt.hashSync(req.body.password, 10);
      const update_data = await UserModel.updateOne(
        { email: email },
        { $set: { password: newpassword } }
      );
      if (update_data.acknowledged) {
        return res.status(200).json({
          data: update_data,
          message: "password updated successfully",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
