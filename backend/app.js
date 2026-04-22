import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { authorizeRoles } from "./middleware/roleMiddleware.js";
import { ROLES } from "./utils/roles.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/gov-only",verifyToken,authorizeRoles(ROLES.GOV), (req,res)=>{
    res.json({message: "Welcome GOV", user: req.user})
});

app.get("/api/manufacture-only", verifyToken, authorizeRoles(ROLES.MANUFACTURER),
        (req,res)=>{
            res.json({message: "Welcome Manufacturer"})
        }
    )

app.get("/health", (req,res)=>{
    res.status(200).json({
        status: "ok",
        message: "Server is running"
    })
});

app.use("/api/auth", authRoutes);

export default app