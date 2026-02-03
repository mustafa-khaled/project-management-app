import { PermissionEnumType } from "@/enums/role.enum";
import { ErrorCodeEnum } from "@/enums/error-code.enum";
import { RoleDocument } from "@/models/roles-permission.model";
import { UnauthorizedException } from "./ApiError";

export const roleGuard = (
  role: RoleDocument,
  requiredPermissions: PermissionEnumType[],
) => {
  const permissions = role.permissions;

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission),
  );

  if (!hasPermission) {
    throw new UnauthorizedException(
      "You are not authorized to perform this action.",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED,
    );
  }
};
