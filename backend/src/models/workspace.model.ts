import { generateInviteCode } from "@/utils/uuid";
import mongoose, { Schema, Document } from "mongoose";

export interface WorkspaceDocument extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new Schema<WorkspaceDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      default: generateInviteCode,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

workspaceSchema.methods.resetInviteCode = function () {
  this.inviteCode = generateInviteCode();
};

export default mongoose.model<WorkspaceDocument>("Workspace", workspaceSchema);
