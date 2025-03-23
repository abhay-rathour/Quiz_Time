import { Schema } from 'mongoose';

export const responseOptionInstanceSchema = new Schema({
    marks: {
        type: Number,
        required: true,
    },
    selected: {
        type: Boolean,
        required: true,
    },
    response_option_id: {
        type: String,
        required: true,
    },
});
