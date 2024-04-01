import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";

class AuthController {
    static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!(username && password)) {
            return res.status(400).json({ message: "Nombre de usuario y contraseña requeridos!" });
        }

        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOne({ where: { username: username } });
            if (!user) {
                return res.status(400).json({ message: "Nombre de usuario o contraseña incorrectos" });
            }

            // Checar la contraseña
            if (!user.checkPassword(password)) {
                return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
            }

            // Si la contraseña es correcta, enviar el usuario
            res.send(user);
        } catch (e) {
            console.error("Error al intentar iniciar sesión:", e);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };
}


export default AuthController;
