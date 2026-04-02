import prisma from "../../config/prisma";
import { SignupInput, LoginInput } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import {
  createToken,
  findToken,
  generateToken,
  revokeToken,
} from "./token.service";
import { TokenType } from "@prisma/client";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "./email.service";

export { googleLogin } from "./oauth.service";

// SIGNUP
export const signup = async (data: SignupInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw { statusCode: 409, message: "Email already registered" };
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: "ANALYST",
    },
  });

  const token = generateToken();

  await createToken(user.id, token, TokenType.VERIFY_EMAIL, 60);

  await sendVerificationEmail(user.email, token);

  return user;
};

// VERIFY EMAIL
export const verifyEmail = async (token: string) => {
  const stored = await findToken(token, TokenType.VERIFY_EMAIL);

  if (!stored) {
    throw { statusCode: 400, message: "Invalid or expired token" };
  }

  await prisma.user.update({
    where: { id: stored.userId },
    data: { isEmailVerified: true },
  });

  await revokeToken(token);

  return true;
};

// LOGIN
export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.password) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  if (!user.isEmailVerified) {
    throw { statusCode: 403, message: "Email not verified" };
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await createToken(user.id, refreshToken, TokenType.REFRESH, 7 * 24 * 60);

  return { accessToken, refreshToken };
};

// REFRESH
export const refreshAuth = async (token: string) => {
  const decoded = verifyRefreshToken(token);

  const stored = await findToken(token, TokenType.REFRESH);

  if (!stored) {
    throw { statusCode: 401, message: "Invalid refresh token" };
  }

  await revokeToken(token);

  const payload = {
    id: decoded.id,
    role: decoded.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await createToken(payload.id, refreshToken, TokenType.REFRESH, 7 * 24 * 60);

  return { accessToken, refreshToken };
};

// FORGOT PASSWORD
export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return true;

  const token = generateToken();

  await createToken(user.id, token, TokenType.RESET_PASSWORD, 30);

  await sendResetPasswordEmail(email, token);

  return true;
};

// RESET PASSWORD
export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  const stored = await findToken(token, TokenType.RESET_PASSWORD);

  if (!stored) {
    throw { statusCode: 400, message: "Invalid or expired token" };
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: stored.userId },
    data: { password: hashed },
  });

  await revokeToken(token);

  return true;
};