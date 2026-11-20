import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";
import { pool } from "../db/index.js";
import type { Role } from "../types/index.js";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Check if the token exist.
      // 2. Verify Token
      // 3. Check if the user exist
      // 4. Is the user active

      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access",
        });
      }

      const decode = jwt.verify(
        token as string,
        config.jwt_secret,
      ) as JwtPayload;
      const user = await pool.query(
        `
    SELECT * FROM users WHERE email=$1
    `,
        [decode.email],
      );
      if (user.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }
      if (!user.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access",
        });
      }

      req.user = decode;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
