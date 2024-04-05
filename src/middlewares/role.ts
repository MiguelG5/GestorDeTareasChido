import { Request, Response, NextFunction } from "express";
import { User } from "../entity/User";
import { getRepository } from "typeorm";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = res.locals.jwtPayload;
        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOneOrFail({ where: { id: userId } }); // Asegúrate de que esta línea tenga condiciones de selección
            const { role } = user;

            if (roles.includes(role)) {
                next();
            } else {
                return res.status(403).json({ message: "No tienes los permisos necesarios para realizar esta acción" });
            }
        } catch (error) {
            console.error("Error al verificar el rol del usuario:", error);
            return res.status(401).json({ message: "Sin permiso" });
        }
    };
};
