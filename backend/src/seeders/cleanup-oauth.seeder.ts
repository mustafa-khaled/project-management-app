import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "@/config/database";
import User from "@/models/user.model";
import Account from "@/models/account.model";
import Workspace from "@/models/workspace.model";
import Member from "@/models/member.model";
import Project from "@/models/project.model";
import Task from "@/models/task.model";

dotenv.config();

const cleanupOAuthUsers = async function () {
  try {
    await connectDB();

    const session = await mongoose.startSession();
    session.startTransaction();

    console.log("🧹 Starting cleanup of OAuth authenticated users...\n");

    // Get all accounts (OAuth users)
    const accounts = await Account.find({}).session(session);
    const userIds = accounts.map((account) => account.userId);

    console.log(`📊 Found ${accounts.length} OAuth accounts`);
    console.log(`👥 Found ${userIds.length} users to delete\n`);

    // Delete all tasks associated with projects owned by these users
    const projects = await Project.find({
      owner: { $in: userIds as any },
    }).session(session);
    const projectIds = projects.map((project) => project._id);

    if (projectIds.length > 0) {
      const tasksResult = await Task.deleteMany(
        { projectId: { $in: projectIds as any } },
        { session },
      );
      console.log(`✅ Deleted ${tasksResult.deletedCount} tasks`);
    }

    // Delete all projects owned by these users
    const projectsResult = await Project.deleteMany(
      { owner: { $in: userIds as any } },
      { session },
    );
    console.log(`✅ Deleted ${projectsResult.deletedCount} projects`);

    // Delete all members associated with these users
    const membersResult = await Member.deleteMany(
      { userId: { $in: userIds as any } },
      { session },
    );
    console.log(`✅ Deleted ${membersResult.deletedCount} members`);

    // Delete all workspaces owned by these users
    const workspacesResult = await Workspace.deleteMany(
      { owner: { $in: userIds as any } },
      { session },
    );
    console.log(`✅ Deleted ${workspacesResult.deletedCount} workspaces`);

    // Delete all OAuth accounts
    const accountsResult = await Account.deleteMany({}, { session });
    console.log(`✅ Deleted ${accountsResult.deletedCount} OAuth accounts`);

    // Delete all users
    const usersResult = await User.deleteMany(
      { _id: { $in: userIds as any } },
      { session },
    );
    console.log(`✅ Deleted ${usersResult.deletedCount} users`);

    await session.commitTransaction();
    console.log("\n✨ Cleanup completed successfully!");
    console.log(
      "🎉 All OAuth authenticated users and their data have been removed.",
    );
    console.log("🔄 You can now re-test your OAuth flow from scratch.\n");

    session.endSession();
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during cleanup:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

cleanupOAuthUsers().catch((err) => {
  console.error("❌ Fatal error during cleanup:", err);
  process.exit(1);
});
