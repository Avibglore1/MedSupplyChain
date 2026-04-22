import { io } from "../server.js";

export const revokeLicense = async (req,res) =>{
    const {id} = req.params;

    //revoke logic

    io.emit("license_update", {
        type: "REVOKED",
        message: `License ${id} revoked`,
        timestamp: new Date(),
    });

    res.json({success: true})
}