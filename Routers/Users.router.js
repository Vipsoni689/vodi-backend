import express from "express";
import { Signin, Signup, Update_User, delete_User, forgatePassword, get_users, sendotp } from "../Controllers/Users.controllers";

const router = express.Router();

router.post("/signup",Signup);
router.get("/get-users",get_users);
router.post("/signin",Signin)
router.put("/update_user/:user_id",Update_User)
router.delete("/delete_user/:user_id",delete_User)
router.post("/send_otp",sendotp)
router.post("/forgate_password",forgatePassword)


export default router;
