import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "No se proporcionó el token de autenticación" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const jwtPayload = jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token de autenticación inválido" });
    }
};
