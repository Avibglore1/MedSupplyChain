import mongoose from "mongoose";
import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { Server } from "socket.io";
dotenv.config();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000"
    }
});

io.on("connection", socket=>{
    console.log("User connected:", socket.id);
})

export {io};

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Mongodb Connected");
    server.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
    })
}).catch(err=>console.log(err))

