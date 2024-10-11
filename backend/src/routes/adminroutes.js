import { Router } from "express";
import { getUsers, deleteUser, editUser } from "../controllers/admin.controller.js";
import authenticate from '../middleware/authMiddleware.js'

const router = Router();

router.route('/users').get(authenticate, getUsers);
router.route('/deleteUser/:id').delete(authenticate, deleteUser);
router.route('/editUser/:id').put(authenticate, editUser);

export default router;
