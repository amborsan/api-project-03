import { Router } from "express";

import {
  getUsers,
  getSingleUser,
  createUsers,
  updateUser,
  deleteUser,
  editUser,
   registerUser, loginUser, logoutUser 

} from '../controllers/user-controller.js'

const router = Router();
router.get('/logout', logoutUser);
router.get("/", getUsers);
router.get("/:id", getSingleUser);
router.post("/",  createUsers);
router.put("/:id",  updateUser);
router.patch("/:id", editUser );
router.delete("/:id", deleteUser);
// User Registration Route
router.post('/register', registerUser);

// User Login Route
router.post('/login', loginUser);

// User Logout Route
export default router;
