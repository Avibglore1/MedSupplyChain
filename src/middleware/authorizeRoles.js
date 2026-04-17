export function authorizeRoles(...allowedRoles){
    return(req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                error: "UNAUTHORIZED",
                message: "Authentication required"
            })
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                error: "FORBIDDEN",
                message: "Insufficent role"
            })
        }
    }
    return next()
}