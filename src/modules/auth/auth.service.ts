import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import type { AuthPayload } from "./auth.interface.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config/index.js";

const loginUserIntoDB = async (payload: AuthPayload) => {
  // Check if the user exist --> Done
  // Check if the password match --> Done
  // Check the user status --> Done
  // If pass all then generate token --> Done

  const { email, password } = payload;

  const user = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );
  if (user.rowCount === 0) {
    throw new Error("Invalid Credentials!!");
  }

  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!!");
  }

  if (!user.rows[0].is_active) {
    throw new Error("User is blocked");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, {
    expiresIn: "10d",
  });

  delete user.rows[0].password;

  return { accessToken, refreshToken, user: user.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized Access");
  }

  const decode = jwt.verify(
    token as string,
    config.refresh_secret,
  ) as JwtPayload;
  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [decode.email],
  );
  if (user.rowCount === 0) {
    throw new Error("User Not Found");
  }
  if (!user.rows[0].is_active) {
    throw new Error("Forbidden");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateAccessToken,
};
