import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "./User";

export interface IInvite extends Document {
  email: string;
  role: UserRole;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
}

const InviteSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["ADMIN", "MANAGER", "STAFF"], required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IInvite>("Invite", InviteSchema);
