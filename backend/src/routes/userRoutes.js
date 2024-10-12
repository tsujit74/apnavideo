import { Router } from "express";
import { addToHistory, getUserHistory, login, register, sendMessage,forgetPassword,resetPassword,getUserEmail } from "../controllers/user.controller.js";


const router  = Router();

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)
router.route("/sendMessage").post(sendMessage)
router.route("/forgetPassword").post(forgetPassword)
router.route("/resetPassword").post(resetPassword)
router.route("/getUserEmail/:id").get(getUserEmail)

export default router;