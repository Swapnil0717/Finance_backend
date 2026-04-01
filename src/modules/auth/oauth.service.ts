import prisma from "../../config/prisma";
import { googleClient } from "../../config/oauth";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { createToken } from "./token.service";
import { TokenType } from "@prisma/client";
import { env } from "../../config/env";

export const googleLogin = async (idToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error("Google authentication failed");
  }

  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name || "Google User",
        provider: "google",
        providerId: payload.sub,
        isEmailVerified: true,
      },
    });
  }

  const jwtPayload = { userId: user.id, role: user.role };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  await createToken(user.id, refreshToken, TokenType.REFRESH, 7 * 24 * 60);

  return { accessToken, refreshToken };
};