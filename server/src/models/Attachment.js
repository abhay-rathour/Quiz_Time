import { Schema, model } from "mongoose";

const attachmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },

    upload_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Group model
export const Attachment = model("Attachment", attachmentSchema);
