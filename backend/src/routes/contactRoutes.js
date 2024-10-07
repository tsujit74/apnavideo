import { Router } from "express";
import contactController from "../controllers/contactController.js";

const router = Router();
router.route('/contact').post(contactController);

export default router;