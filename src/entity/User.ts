import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { MinLength, IsNotEmpty, IsEmail  } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["username"])

export class User {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    @MinLength(5)
    @IsEmail()
    @IsNotEmpty()
    username: string

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    password: string

    @Column()
    @IsNotEmpty()
    role: string

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    upDateAt: Date;

    //metodo para incriptar la contraseña
    hashPassword():void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    //metodo para checar la contraseña
    checkPassword(password: string):boolean{
        return bcrypt.compareSync(password, this.password)
    }


}
