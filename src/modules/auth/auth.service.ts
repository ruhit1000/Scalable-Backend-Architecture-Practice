import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import type { AuthPayload } from "./auth.interface.js";
import jwt from "jsonwebtoken";

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
  };

  const accessToken = jwt.sign(jwtPayload, "dfhsajhffdsweatb", {
    expiresIn: "1d",
  });

  delete user.rows[0].password;

  return { accessToken, user: user.rows[0] };
};

export const authService = {
  loginUserIntoDB,
};
