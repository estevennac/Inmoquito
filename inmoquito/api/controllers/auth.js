import { db } from "../db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const register = (req,res)=>{
    //Verificar si exisite ya un usuario
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(q,[req.body.email, req.body.name], (err,data)=>{
        if(err) return res.json(err)
        if(data.length) return res.status(409).json("Usuario ya existente");
        //instalar npm install bcryptjs para hashear
        //Hash de la clave
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password,salt);

        // Guardar imagen en la base de datos
        const q = "INSERT INTO users(`username`,`email`,`img`,`password`) VALUES (?)";
        const values = [
            req.body.username,
            req.body.email,
            req.body.img,
            hash,
        ];
        db.query(q,[values],(err,data)=>{
            if(err) return res.json(err);
            return res.status(200).json("Usuario creado");
        });
    });
}

export const login = (req,res)=>{
    //verificar usuario
    const q = "SELECT * FROM users WHERE username = ?";
    
    db.query(q,[req.body.username], (err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length===0) return res.status(404).json("Usuario no encontrado!");

        //verificar clave
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        if(!isPasswordCorrect) return res.status(400).json("Usuario o clave incorrectos!");

        const token = jwt.sign({id:data[0].id},"jwtkey");
        const {password,...other}= data[0]

        res.cookie("access_token",token,{
            httpOnly:true,
        }).status(200).json(other);
    });
}

export const logout = (req,res)=>{
    res.clearCookie("access_token",{
        sameSite: "none",
        secure: true
    }).status(200).json("Ha salido con exito")
}

//npm install jsonwebtoken   usar para eliminar unicamente algo que pertenezaca a un usuario, no se puede borrar cosas de otros usuarios