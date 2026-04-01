import prisma from "../../config/prisma";
import { TokenType } from "@prisma/client";
import crypto from "crypto";
import { addMinutes } from "date-fns";

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateToken = () => crypto.randomBytes(32).toString("hex");

export const createToken = async (
  userId: string,
  rawToken: string,
  type: TokenType,
  minutes: number
) => {
  const hashed = hashToken(rawToken);

  return prisma.token.create({
    data: {
      userId,
      token: hashed,
      type,
      expiresAt: addMinutes(new Date(), minutes),
    },
  });
};

export const findToken = async (rawToken: string, type: TokenType) => {
  const hashed = hashToken(rawToken);

  return prisma.token.findFirst({
    where: {
      token: hashed,
      type,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
  });
};

export const revokeToken = async (rawToken: string) => {
  const hashed = hashToken(rawToken);

  return prisma.token.updateMany({
    where: { token: hashed },
    data: { isRevoked: true },
  });
};