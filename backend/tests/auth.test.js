import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "./../app.js";
import jwt from "jsonwebtoken";

const generateToken = (role) =>{
    return jwt.sign(
        {id: "123", email: "test@test.com", role},
        process.env.JWT_SECRET || supersecretkey
    )
};

describe("Auth Middleware Tests", ()=>{
    test("❌ No token should return 401", async()=>{
        const res = await request(app).get("/api/gov-only");
        expect(res.statusCode).toBe(401);
    });

    test("❌ Invalid token should return 401",async()=>{
        const res = await request(app)
        .get("/api/gov-only")
        .set("Authorization", "Bearer invalidToken");
        expect(res.statusCode).toBe(401);
    });

    test("❌ Wrong role should return 403", async()=>{
        const token = generateToken("PHARMACY");
        const res = await request(app)
        .get("/api/gov-only")
        .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);
    });

    test("✅ Correct role should pass", async()=>{
        const token = generateToken("GOV");
        const res = await request(app)
        .get("/api/gov-only")
        .set("Authorization", `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
    })
})