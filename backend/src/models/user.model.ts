import { compareValues, hashValues } from "@/utils/bcrypt";
import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture?: string | null;
  isActive: boolean;
  failedLoginAttempts: number;
  lockUntil?: Date;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  currentWorkspace: mongoose.Types.ObjectId | null;
  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    profilePicture: {
      type: String,
      required: false,
      select: false,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: false,
      select: false,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      required: false,
      select: false,
      default: null,
    },
    currentWorkspace: {
      type: mongoose.Types.ObjectId,
      ref: "Workspace",
      required: false,
      select: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await hashValues(this.password);
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
  const useObj = this.toObject();
  delete useObj.password;

  return useObj;
};

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  if (!this.password) return false;
  return await compareValues(password, this.password);
};

export default mongoose.model<UserDocument>("User", userSchema);
