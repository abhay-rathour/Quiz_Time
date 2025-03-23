import { Schema, model } from 'mongoose';

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            required: true,
            enum: ['open', 'closed', 'private'],
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
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

// Create the Group model
export const Group = model('Group', groupSchema);
