import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();


router.get("/:id", userController.getUserById);
router.get("/email/:email", userController.getUserByEmail);
router.get("/name/:name", userController.getUsersByName);
router.get("/", userController.getAllUsers);
router.post("/", userController.registerUser);

export default router;
