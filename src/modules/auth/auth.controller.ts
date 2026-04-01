import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ message: "User created. Verify email." });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.verifyEmail(req.query.token as string);
    res.json({ message: "Email verified" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokens = await authService.login(req.body);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const tokens = await authService.refreshAuth(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "If email exists, reset link sent" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.resetPassword(
      req.body.token,
      req.body.password
    );
    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;
    const tokens = await authService.googleLogin(idToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};