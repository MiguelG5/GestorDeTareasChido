import { getRepository } from "typeorm";
import { Request, Response} from "express" 
import {User} from "../entity/User"; 
import { validate } from "class-validator"; 

export class UserController {

    static getAll = async(req: Request, res: Response) =>{
        const userRepository = getRepository(User);
        const users = await userRepository.find();

        if (users.length > 0 ){
            res.send(users);
        } else {
            res.status(404).json({message: "No resultados"});
        }
    };
    static getById = async(req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);
    
        try {
            const user = await userRepository.findOneOrFail({ where: { id } });
            res.send(user);
        } catch (error) {
            console.error("Error al recuperar usuario:", error);
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    };
    
    static newUser = async(req: Request, res: Response) =>{
        const {username, password, role} = req.body
        const user = new User();
    
        user.username = username;
        user.password = password;
        user.role = role;
    
        //Validaciones
        const errors = await validate(user);
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        const userRepository = getRepository(User)
        try{
            user.hashPassword();
            await userRepository.save(user);
            return res.status(201).json({ message: "Usuario creado", user });
            // Aquí se envía un objeto JSON que contiene el mensaje y el usuario creado.
        }
        catch(e){
            return res.status(409).json({message: "Nombre de usuario ya existe"});
        }
    };

    static editUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { username, role } = req.body;
    
        const userRepository = getRepository(User);
    
        try {
            let user = await userRepository.findOneOrFail({ where: { id } });
            user.username = username;
            user.role = role;
    
            const errors = await validate(user);
            if (errors.length > 0) {
                return res.status(400).json(errors);
            }
    
            await userRepository.save(user);
    
            res.status(200).json({ message: "Usuario actualizado", user });
        } catch (error) {
            console.error("Error al editar usuario:", error);
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    };     

    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOneOrFail({ where: { id } }); // Proporciona condiciones de búsqueda
            await userRepository.remove(user); // Eliminar el usuario
            return res.status(200).json({ message: "Usuario eliminado" });
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    };
    
}

export default UserController;