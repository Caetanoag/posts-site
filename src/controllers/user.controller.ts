import type { Request, Response } from "express";
import * as userService from "../services/user.services";

export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const user = await userService.getUserById(id);
    if (user === null) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user: ", err);
    return res.status(500).json({ error: "Error fetching user" });
  }
};
export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email as string;
  if (!email) {
    return res.status(400).json({ error: "Invalid Email" });
  }
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user: ", err);
    return res.status(500).json({ error: "Error fetching user" });
  }
};
export const getUsersByName = async (req: Request, res: Response) => {
  const name = req.params.name as string;
  if (!name) {
    return res.status(400).json({error: "Invalid name"})
  }
  try {
    const users = await userService.getUsersByName(name);
    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(users);
  }
  catch (err) {
    console.error("Error fetching users: ", err);
    return res.status(500).json({ error: "Error fetching users" });
  }
}
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email or password is invalid" });
  }
  try {
    const result = await userService.registerUser({ name, email, password });
    if (!result) {
      return res.status(500).json({ error: "Something went wrong while creating new user" });
    }
    return res.status(200).json(result);
  }
  catch(err) {
    console.error("Error creating user: ", err);
    return res.status(500).json({ error: "Error creating user" });
  }
}
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    return res.status(200).json(users);
  }
  catch (err) {
    console.error("Error while fetching users: ", err);
    return res.status(500).json({ error: "Error fetching users" });
  }
}
