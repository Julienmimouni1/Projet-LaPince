import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "./index.js";
import { prisma } from "../lib/prisma.js";

const testEmail = `test_${Date.now()}@lapince.fr`;

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testEmail } });
  await prisma.$disconnect();
});

describe("POST /auth/register", () => {
  it("crée un compte et retourne 201 avec les infos (sans le mot de passe)", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        first_name: "Test",
        last_name:  "User",
        email:      testEmail,
        password:   "Motdepasse1@",
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("refuse un doublon d'email avec 409", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        first_name: "Test",
        last_name:  "User",
        email:      testEmail,
        password:   "Motdepasse1@",
      });

    expect(res.status).toBe(409);
  });

  it("refuse un mot de passe sans majuscule ni caractère spécial avec 400", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        first_name: "Test",
        last_name:  "User",
        email:      "autre@lapince.fr",
        password:   "trop_court",
      });

    expect(res.status).toBe(400);
  });
});
