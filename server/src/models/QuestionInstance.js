import { Schema, model } from "mongoose";
import { responseOptionInstanceSchema } from "./ResponseOptionInstance.js";
  
const questionInstanceSchema = new Schema({
    marks: {
        type: Number,
        required: true
    },
    answered: {
        type: Boolean,
        required: true
    },
    selected_choices: {
        type: String
    },
    text_response: {
        type: String
    },
    number_response: {
        type: Number
    },
    bool_response: {
        type: Boolean
    },
    test_instance: {
        type: Schema.Types.ObjectId, 
        ref: "TestInstance",
        required: true
    },
    question:{
        type: Schema.Types.ObjectId, 
        ref: "Question",
        required: true
    },
    section_index:{
        type: Number,
        required:true
    },
    attachments:[{
        type: Schema.Types.ObjectId, 
        ref: "Attachment",
        required: true
    }],

    response_option_instances: [responseOptionInstanceSchema], // Embedded Response Option Instances
  });
  
export const QuestionInstance = model("QuestionInstance", questionInstanceSchema);
  