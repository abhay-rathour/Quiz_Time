import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

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
        password: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            match: [
                /^\S+@\S+.\S+$/,
                'Given email address is invalid. Please enter a valid email.',
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

// Pre save hook to hash password before saving
// eslint-disable-next-line
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const User = model('User', userSchema);
