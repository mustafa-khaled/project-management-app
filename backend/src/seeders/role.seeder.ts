import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "@/config/database";
import { Role } from "@/models/roles-permission.model";
import { RolePermission } from "@/utils/role-permission";

dotenv.config();

const seedRoles = async function () {
  try {
    await connectDB();

    const session = await mongoose.startSession();
    session.startTransaction();
    await Role.deleteMany({}, { session });

    for (const roleName in RolePermission) {
      const role = roleName as keyof typeof RolePermission;
      const permission = RolePermission[role];

      const existingRole = await Role.findOne({ name: role }).session(session);

      if (!existingRole) {
        const newRole = new Role({
          name: role,
          permissions: permission,
        });
        await newRole.save({ session });
      } else {
        console.log("Role already exist");
      }
    }
    await session.commitTransaction();
    console.log("Seeding completed successfully");
    session.endSession();
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.log("err: ", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedRoles().catch((err) => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
