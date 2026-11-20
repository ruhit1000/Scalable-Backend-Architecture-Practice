import { Router } from "express";
import { profileController } from "./profile.controller.js";

const router = Router()
// /api/v1/profile

router.post("/", profileController.createProfile)

export const profileRoute = router