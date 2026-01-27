import mongoose, { Schema, Document } from "mongoose";
import {
  PermissionEnum,
  PermissionEnumType,
  RoleEnum,
  RoleEnumType,
} from "@/enums/role.enum";
import { RolePermission } from "@/utils/role-permission";

export interface RoleDocument extends Document {
  name: RoleEnumType;
  permissions: Array<PermissionEnumType>;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      enum: Object.values(RoleEnum),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(PermissionEnum),
      required: true,
      default: function (this: RoleDocument) {
        return RolePermission[this.name];
      },
    },
  },
  {
    timestamps: true,
  },
);

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);
export { RoleModel as Role };
export default RoleModel;
