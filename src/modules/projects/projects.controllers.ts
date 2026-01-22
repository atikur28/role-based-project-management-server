import { Request, Response } from "express";
import Project, { ProjectStatus } from "../../models/Project";

interface AuthRequest extends Request {
  user?: any;
}

const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ isDeleted: false })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.isDeleted)
      return res.status(404).json({ message: "Project not found" });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body as {
      name?: string;
      description?: string;
      status?: ProjectStatus;
    };

    const project = await Project.findById(id);
    if (!project || project.isDeleted)
      return res.status(404).json({ message: "Project not found" });

    if (name) project.name = name;
    if (description) project.description = description;
    if (status && ["ACTIVE", "ARCHIVED", "DELETED"].includes(status))
      project.status = status;

    await project.save();

    res.json({ message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project || project.isDeleted)
      return res.status(404).json({ message: "Project not found" });

    project.isDeleted = true;
    project.status = "DELETED";
    await project.save();

    res.json({ message: "Project soft deleted", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const projectsControllers = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
