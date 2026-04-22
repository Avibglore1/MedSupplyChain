import jwt from "jsonwebtoken";
import { ROLES } from "../utils/roles.js";

export const login = async(req,res) =>{
    const {email,role} = req.body;

    if(!Object.values(ROLES).includes(role)){
        return res.status(400).json({
            message: "Invalid role"
        })
    }
    
    
    const user = {
        id: "123",
        email,
        role
    };
    
    const token = jwt.sign(user, process.env.JWT_SECRET,{
        expiresIn: "1d"
    })

    res.json({token,user})
}