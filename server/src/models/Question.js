import { Schema, model } from "mongoose";
import { responseOptionSchema } from "./ResponseOption.js";
  
const questionSchema = new Schema(
    {
        label: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        question_type: {
            type: String,
            enum: ["text", "number", "boolean", "attachment", "single_select", "multi_select"],
            default: "number"
        },
        order: {
            type: Number,
            required: true
        },

        test: {
            type: Schema.Types.ObjectId,
            ref: "Test",
            required: true
        },

        section: {
            type: Number,
            required:true,
        },

        marks: {
            type: Number,
            required: true
        },

        attachments:[{
            type: Schema.Types.ObjectId,
            ref: "Attachment",
            required: true
        }],

        guidance:{
            type: String
        },
        
        response_options: [responseOptionSchema], // Embedding Response Option Schema
  },{
    timestamps:true
  });
  
export const Question = model("Question", questionSchema);