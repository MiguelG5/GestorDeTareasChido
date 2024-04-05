import { Router } from "express";
import { UserController } from "../controller/UserController";
import { checkJwt } from "../middlewares/jwt";
import { checkRole } from "../middlewares/role";

const router = Router();

router.get("/",[checkJwt], UserController.getAll);
router.get("/:id",[checkJwt], UserController.getById);
router.post("/",[checkJwt, checkRole(["admin"])], UserController.newUser);
router.put("/:id",[checkJwt], UserController.editUser); // Agrega esta línea para manejar solicitudes PUT
router.delete("/:id",[checkJwt], UserController.deleteUser);

export default router;
