import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import jwtAuth from "../src/middleware/jwtAuth.js";
import { authorizeRoles } from "../src/middleware/authorizeRoles.js";
import { ROLES } from "../src/constants/roles.js";

describe("JWT auth + role middleware rejection cases", ()=>{
    const SECRET = "test-secret";
    let app;

    beforeAll(()=>{
        process.env.JWT_SECRET = SECRET;
    });

    beforeEach(()=>{
        app = express();
        app.use(express.json());

        app.get("/gov-only", jwtAuth, authorizeRoles(ROLES.GOV), (req,res)=>{
            res.status(200).json({ok: true});
        })
    });

    test("401 when Authorization header is missing", async ()=>{
        const res = await request(app).get("/gov-only");
        expect(res.status).toBe(401);
        expect(res.body.error).toBe("UNAUTHORIZED");
    });

    test("401 when Authorization format is not Bearer", async()=>{
        const res = await request(app)
        .get("/gov-only")
        .set("Authorization", "Basic 123");
        expect(res.status).toBe(401);
    });

    test("401 when token is invalid", async()=>{
        const res = await request(app)
        .get("/gov-only")
        .set("Authorization", "Bearer not-a-real-token");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid token");
    });

    test("401 when token is expired", async()=>{
        const token = jwt.sign({sub: "u1", role: ROLES.GOV}, SECRET, {expiresIn: -10});
        const res = await request(app)
        .get("/gov-only")
        .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Token expired");
    })
})