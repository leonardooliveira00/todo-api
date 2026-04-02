import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { AppError } from "../errors/app-error";
import { HTTP_STATUS } from "../errors/http-status";

export const AuthController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const standardizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: standardizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user)
      throw new AppError(
        "Email ou senha incorretos.",
        HTTP_STATUS.UNAUTHORIZED,
      );

    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch)
      throw new AppError(
        "Email ou senha incorretos.",
        HTTP_STATUS.UNAUTHORIZED,
      );

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  },

  async me(req: Request, res: Response) {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user)
      throw new AppError(
        "Erro ao encontrar o usuário",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );

    return res.json(user);
  },
};
