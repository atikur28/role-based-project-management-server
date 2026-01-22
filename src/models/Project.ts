import mongoose, { Document, Schema } from "mongoose";

export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "DELETED";

export interface IProject extends Document {
  name: string;
  description: string;
  status: ProjectStatus;
  isDeleted: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED", "DELETED"],
      default: "ACTIVE",
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IProject>("Project", ProjectSchema);
