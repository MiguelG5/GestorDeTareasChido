import { Router } from "express";
import UserController from "../controller/UserController";

const router = Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.post("/", UserController.newUser);
router.put("/:id", UserController.editUser); // Agrega esta línea para manejar solicitudes PUT
router.delete("/:id", UserController.deleteUser);

export default router;
