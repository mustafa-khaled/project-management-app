import { ProviderEnumType, ProviderEnum } from "@/enums/account-provider.enum";
import mongoose, { Schema, Document } from "mongoose";

export interface AccountDocument extends Document {
  provider: ProviderEnumType;
  providerId: string;
  userId: mongoose.Types.ObjectId;
  refreshToken?: string | null;
  tokenExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<AccountDocument>(
  {
    provider: {
      type: String,
      required: true,
      enum: Object.values(ProviderEnum),
    },
    providerId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    refreshToken: { type: String, required: true, default: null },
    tokenExpiry: { type: Date, required: true, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.refreshToken;
      },
    },
  },
);

export default mongoose.model<AccountDocument>("Account", accountSchema);
