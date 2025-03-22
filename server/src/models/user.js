import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    first_name: {
      type: String,
      required: true,
      trim: true,
    },

    last_name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: [
        /^\S+@\S+.\S+$/,
        "Given email address is invalid. Please enter a valid email.",
      ],
    },

    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
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
export const User = model("User", userSchema);
