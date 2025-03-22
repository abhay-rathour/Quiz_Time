import { Schema, model } from "mongoose";
import { sectionSchema } from "./Section.js";
  
const testSchema = new Schema(
    {
        test_id: { type: String, required: true, unique: true, index: true },
        title: {
            type: String,
            required: true
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },
        total_marks: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        state: {
            type: String,
            enum: ["draft", "published", "retired"],
            default: "draft"
        },
        sections: [sectionSchema], // Embedding Section Schema
  });
  
export const Test = model("Test", testSchema);