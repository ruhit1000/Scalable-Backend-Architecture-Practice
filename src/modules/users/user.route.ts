import { Router } from "express";
import { userController } from "./user.controller.js";
import auth from "../../middleware/auth.js";

const router = Router();

// /api/v1/users/
router.post("/", userController.createUser);
router.get("/", auth, userController.getAllUser);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
