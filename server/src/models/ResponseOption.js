import { Schema } from 'mongoose';

export const responseOptionSchema = new Schema(
    {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
        },

        order: {
            type: Number,
            required: true,
        },

        choice_type: {
            type: String,
            enum: ['text', 'label_value', 'attachment'],
            default: 'text',
        },

        attachment: {
            type: Schema.Types.ObjectId,
            ref: 'Attachment',
        },

        marks: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
