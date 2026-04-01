import prisma from "../../config/prisma";
import { SignupInput, LoginInput } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { createToken, findToken, generateToken, revokeToken } from "./token.service";
import { TokenType } from "@prisma/client";
import { sendVerificationEmail, sendResetPasswordEmail } from "./email.service";

export { googleLogin } from "./oauth.service";

export const signup = async (data: SignupInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });

  const token = generateToken();

  await createToken(user.id, token, TokenType.VERIFY_EMAIL, 60);

  await sendVerificationEmail(user.email, token);

  return user;
};

export const verifyEmail = async (token: string) => {
  const stored = await findToken(token, TokenType.VERIFY_EMAIL);

  if (!stored) throw new Error("Invalid or expired token");

  await prisma.user.update({
    where: { id: stored.userId },
    data: { isEmailVerified: true },
  });

  await revokeToken(token);

  return true;
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.password) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) {
    throw new Error("Email not verified");
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  const payload = { userId: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await createToken(user.id, refreshToken, TokenType.REFRESH, 7 * 24 * 60);

  return { accessToken, refreshToken };
};

export const refreshAuth = async (token: string) => {
  if (!token) {
    throw new Error("Refresh token required");
  }

  const decoded = verifyRefreshToken(token);

  const stored = await findToken(token, TokenType.REFRESH);

  if (!stored) throw new Error("Invalid refresh token");

  await revokeToken(token);

  // ✅ CLEAN PAYLOAD (IMPORTANT)
  const payload = {
    userId: decoded.userId,
    role: decoded.role,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await createToken(
    payload.userId,
    newRefreshToken,
    TokenType.REFRESH,
    7 * 24 * 60
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return true;

  const token = generateToken();

  await createToken(user.id, token, TokenType.RESET_PASSWORD, 30);

  await sendResetPasswordEmail(email, token);

  return true;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const stored = await findToken(token, TokenType.RESET_PASSWORD);

  if (!stored) throw new Error("Invalid or expired token");

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: stored.userId },
    data: { password: hashed },
  });

  await revokeToken(token);

  return true;
};