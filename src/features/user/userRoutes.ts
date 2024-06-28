import express from "express";
import { changePassword, getProfile, updateProfile } from "./userController";
import { authenticate } from "../../middlwares/authMiddleware";

const router = express.Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);

export default router;
