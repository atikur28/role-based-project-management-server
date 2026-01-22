import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import Invite from "../../models/Invite";
import User from "../../models/User";

const JWT_EXPIRES_IN = "14d";

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.jwt || "secret", {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const createInvite = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const existingInvite = await Invite.findOne({ email });
    if (existingInvite)
      return res.status(400).json({ message: "Invite already sent" });

    const token = crypto.randomBytes(20).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const invite = await Invite.create({ email, role, token, expiresAt });

    res.status(201).json({ message: "Invite created", token: invite.token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const getInvites = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const invites = await Invite.find({
      acceptedAt: null,
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    res.json({ invites });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const registerViaInvite = async (req: Request, res: Response) => {
  try {
    const { token, name, password } = req.body;

    const invite = await Invite.findOne({ token });
    if (!invite)
      return res.status(400).json({ message: "Invalid invite token" });
    if (invite.expiresAt < new Date())
      return res.status(400).json({ message: "Invite expired" });
    if (invite.acceptedAt)
      return res.status(400).json({ message: "Invite already used" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      invitedAt: new Date(),
      status: "ACTIVE",
    });

    invite.acceptedAt = new Date();
    await invite.save();

    const jwtToken = generateToken(user._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.status !== "ACTIVE")
      return res.status(403).json({ message: "User inactive" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const authControllers = {
  createInvite,
  registerViaInvite,
  login,
  getInvites,
};
