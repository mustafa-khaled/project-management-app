import {
  PermissionEnum,
  PermissionEnumType,
  RoleEnum,
  RoleEnumType,
} from "@/enums/role.enum";
import mongoose, { Schema, Document } from "mongoose";

export interface RoleDocument extends Document {
  name: RoleEnumType;
  permissions: Array<PermissionEnumType>;
}

const roleSchema = new Schema({
  name: {
    type: RoleEnum,
    required: true,
    unique: true,
  },
  permissions: {
    type: [PermissionEnum],
    required: true,
  },
});

export default mongoose.model<RoleDocument>("RoleDocument", roleSchema);
