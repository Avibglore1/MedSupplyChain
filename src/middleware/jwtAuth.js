import jwt from "jsonwebtoken";
export default function jwtAuth(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Missing or invalid token"
        })
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        if(!payload?.role){
            return res.status(401).json({
                error: "UNAUTHORIZED",
                message: "Token payload missing role"
            })
        }
        req.user = {
            id: payload.sub ?? null,
            role: payload.role
        };
        next();
    } catch (error) {
        return res.status(401).json({message: "Token verification failed"});
    }
}