import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import config from "../config";
import Project from "../models/Project";
import User from "../models/User";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(config.mongodb_uri!);

    await User.deleteMany({});
    await Project.deleteMany({});

    const password = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@demo.com",
      password,
      role: "ADMIN",
      status: "ACTIVE",
    });

    const manager = await User.create({
      name: "Project Manager",
      email: "manager@demo.com",
      password,
      role: "MANAGER",
      status: "ACTIVE",
    });

    const staff = await User.create({
      name: "Staff User",
      email: "staff@demo.com",
      password,
      role: "STAFF",
      status: "ACTIVE",
    });

    console.log("✅ Users created");

    await Project.create([
      {
        name: "Website Redesign",
        description: "Redesign company website",
        status: "ACTIVE",
        isDeleted: false,
        createdBy: admin._id,
      },
      {
        name: "Mobile App",
        description: "Build Android App",
        status: "ACTIVE",
        isDeleted: false,
        createdBy: manager._id,
      },
      {
        name: "Old CRM System",
        description: "Legacy system (soft deleted)",
        status: "DELETED",
        isDeleted: true,
        createdBy: admin._id,
      },
    ]);

    console.log("SEEDING COMPLETE 🎉");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
