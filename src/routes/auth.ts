import {Router} from "express"
import AuthController from "../controller/AuthController"
import { checkJwt } from "../middlewares/jwt";

const router = Router();

//Login
router.post("/login", AuthController.login)

//Cambio de contraseña
router.post('/change-password', [checkJwt], AuthController.changePassword);
export default router;