import { Router } from "express";
import { UserController } from "../controller/UserController";
import { checkJwt } from "../middlewares/jwt";
import { checkRole } from "../middlewares/role";


const router = Router();

router.get("/",[checkJwt, checkRole(["admin"])], UserController.getAll);
router.get("/:id",[checkJwt, checkRole(["admin"])], UserController.getById);
router.post("/",[checkJwt, checkRole(["admin"])], UserController.newUser);
router.put("/:id",[checkJwt, checkRole(["admin"])], UserController.editUser); // Agrega esta línea para manejar solicitudes PUT
router.delete("/:id",[checkJwt, checkRole(["admin"])], UserController.deleteUser);

export default router;
