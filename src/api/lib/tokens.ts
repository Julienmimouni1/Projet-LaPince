import jwt from "jsonwebtoken"
import { config } from "../config.ts";
import type { User } from "@prisma/client";

export function generateAuthTokens(user: User) {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "15m",
    audience: "access",
  });
  const refreshToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "7d",
    audience: "refresh",
  });

  return {
    accessToken: {
      token: accessToken,
      expiresIn: 15 * 60 * 1000,
    },
    refreshToken: {
      token: refreshToken,
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    },
  };
}
