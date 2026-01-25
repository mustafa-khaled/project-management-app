import mongoose, { Schema, Document } from "mongoose";

export interface ProjectDocument extends Document {
  name: string;
  description: string | null;
  emoji: string;
  workspaceId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    emoji: {
      type: String,
      required: false,
      default: "",
    },
    workspaceId: {
      type: mongoose.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ProjectDocument>("Project", projectSchema);
