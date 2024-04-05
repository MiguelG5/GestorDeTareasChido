import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { validate } from "class-validator";

class AuthController {
    static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!(username && password)) {
            return res.status(400).json({ message: "Nombre de usuario y contraseña requeridos!" });
        }

        const userRepository = getRepository(User);
        let user: User; // Declaración de la variable fuera del bloque try

        try {
            user = await userRepository.findOne({ where: { username: username } });
            if (!user) {
                return res.status(400).json({ message: "Nombre de usuario o contraseña incorrectos" });
            }

            // Checar la contraseña
            if (!user.checkPassword(password)) {
                return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
            }

            // Generar token JWT
            const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: "1h" });

            // Si la contraseña es correcta, enviar el usuario y el token
            res.json({message: "OK", token});
        } catch (e) {
            console.error("Error al intentar iniciar sesión:", e);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };
    static changePassword= async(req: Request, res: Response )=>{
        const {userId} = res.locals.jwtPayload;
        const {oldPassword, newPassword}= req.body;

        if(!(oldPassword && newPassword)){
            res.status(400).json({message:"La contraseña antigua y la nueva son requeriadas"})

        }

        const userRepository = getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneByOrFail(userId);
        }
        catch (e){
            res.status(400).json({message: "Error"});
        }

        if(!user.checkPassword(oldPassword)){
            return res.status(401).json({message: "checa tu vieja contraseña"});
        }
        user.password = newPassword;
        const validationOps={validationError:{target: false, value: false}};
        const errors = await validate(user, validationOps)

        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        user.hashPassword();
        userRepository.save(user);

        res.json({ message: "Su contraseña se cambio con exito"})
    }
}

export default AuthController;
