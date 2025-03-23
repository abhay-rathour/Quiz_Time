import { Schema } from 'mongoose';

export const sectionSchema = new Schema({
    section_id: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    total_question: {
        type: Number,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    total_marks: {
        type: Number,
        required: true,
    },
});
