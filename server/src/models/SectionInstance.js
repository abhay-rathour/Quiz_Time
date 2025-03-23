import { Schema } from 'mongoose';

export const sectionInstanceSchema = new Schema({
    marks: {
        type: Number,
        required: true,
    },
    unanswered_count: {
        type: Number,
        required: true,
    },
    total_questions: {
        type: Number,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    section_id: {
        type: String,
        required: true,
    },
});
