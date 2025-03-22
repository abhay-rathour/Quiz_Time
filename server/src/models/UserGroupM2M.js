import { Schema, model } from "mongoose";

const userGroupM2MSchema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group", // Reference to the Group model
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["assessor", "manager", "admin"],
    },
    membership_status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create the UserGroupM2M model
export const UserGroupM2M = model("UserGroupM2M", userGroupM2MSchema);
