import { pool } from "../config/database";
import argon2 from "argon2";
import type { CreateUserInput, User } from "../models/user.model";


const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
};
const hash = async (password: string): Promise<string> => {
  try {
    const hash = await argon2.hash(password, ARGON2_OPTIONS);
    return hash;
  } catch (err) {
    console.error("Error while hashing password: ", err);
    throw new Error("Failure generating password hash");
  }
};

const verifyPassword = async (plain: string, hash: string): Promise<boolean> => {
  try {
    return await argon2.verify(hash, plain);
  }
  catch 		(err){
    console.error("Error verifying password:", err);
    throw new Error("Failure at the password verification")
  }
}
export const getAllUsers = async (): Promise<Array<User>> =>{
  const result = await pool.query(`
    select id, name, email from users
    order by id
    `);
  const data = result.rows;
  return data;
}
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query(
    `
    select id, name, email from users
    where email = $1
  `,
    [email],
  );
  const data = result.rows;
  if (data.length === 0) return null;
  return data[0];
};
export const getUsersByName = async (name: string): Promise<Array<User> | null> => {
  const result = await pool.query(
    `
    select id, name, email from users
    where name = $1
    order by id
    `,
    [name],
  );
  const data = result.rows;
  if (data.length === 0) return null;
  return data;
};
export const getUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query(
    `
    select id, name, email from users
    where id = $1`,
    [id],
  );
  const data = result.rows;
  if (data.length === 0) return null;
  return data[0];
};
export const registerUser = async (
  userInfo: CreateUserInput,
): Promise<User | null> => {
  const hashedPassword = await hash(userInfo.password);
  if (hashedPassword === null) throw new Error("Error while hashing the password");
  const result = await pool.query(
    `
    insert into users (name, email, password)
    values($1, $2, $3)
    returning id, name, email
    `,				[userInfo.name, userInfo.email, hashedPassword],
  );
  const data = result.rows;
  if (data.length === 0) return null;
  return data[0];
};
const getPasswordHashByEmail = async (email: string): Promise<string | null> => {
    const result = await pool.query(
        `SELECT password FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0]?.password || null;
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const storedHash = await getPasswordHashByEmail(email);
  if (!storedHash) return null;
  const isValid = await verifyPassword(password, storedHash);
  if (!isValid) return null;
  if (argon2.needsRehash(storedHash, ARGON2_OPTIONS)) {
    const newHash = await hash(password);
    await pool.query(
      `update users set password = $1 where email = $2`, [newHash, email]
    );
  }
  return await getUserByEmail(email);
}
