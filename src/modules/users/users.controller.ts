import { Request, Response } from "express";
import User, { IUser, UserRole, UserStatus } from "../../models/User";

interface AuthRequest extends Request {
  user?: IUser;
}

const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await User.countDocuments();
    const users = await User.find()
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body as { role: UserRole };

    if (!["ADMIN", "MANAGER", "STAFF"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated",
      user: { id: user._id, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: UserStatus };

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    res.json({
      message: `User status updated to ${status}`,
      user: { id: user._id, status: user.status },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const usersControllers = {
  getUsers,
  updateUserRole,
  updateUserStatus,
};
