import { Request, Response, NextFuncion } from "express";
import { User } from "../entity/User";
import { getRepository } from "typeorm";

export const checkRole = (roles: Array<string>)=> {

    return async (req: Request, res: Response, next: NextFuncion)=>{

        const {userid}= res.locals.jwtPayLoad;
        const userRepository = getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail(userid);
        }
        catch(e){
            return res.status(401).json({message: "No autorizado"})
        }

        const {role} = user;
        if(roles.includes(role)){
            next();
        }else{
            res.status(401).json({message: "No autorizado"})
        }
    }
}

//minuto 1:58