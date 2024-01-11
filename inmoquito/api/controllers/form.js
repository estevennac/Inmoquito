import { db } from "../db.js";


export const getForm = (req,res)=>{
    
    const q = "INSERT INTO cotizar(`nombre`,`email`,`fechaCotizacion`,`comentario`) VALUES (?)";
    const values = [
        req.body.nombre,
        req.body.email,
        req.body.fechaCotizacion,
        req.body.comentario,
    ];

    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json("Formulario creado");
    });
}