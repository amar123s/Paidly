import { describe,it,expect } from "vitest";
import request from "supertest";
import app from "../app.js"


describe("API",()=>{
    it("health works",async()=>{
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
    });

    it("rejects invoices without a token",async()=>{
        const res = await request(app).get("/api/invoices");
        expect(res.status).toBe(401);
    });

     it("rejects an Invalid token",async()=>{
        const res = await request(app).get("/api/invoices").set("Authorization","Bearer junk");
        expect(res.status).toBe(401);
    });
})