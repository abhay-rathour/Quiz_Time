import { Schema, model } from 'mongoose';
import { sectionInstanceSchema } from './SectionInstance.js';

const testInstanceSchema = new Schema({
    test: {
        type: Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    marks: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    state: {
        type: String,
        enum: ['open', 'closed', 'cancelled'],
        default: 'open',
    },
    unanswered_count: {
        type: Number,
        required: true,
    },
    participant_status: {
        type: String,
        enum: ['started', 'invited', 'completed'],
        required: true,
    },
    section_instances: [sectionInstanceSchema], // Embedded Section Instances
});

export const TestInstance = model('TestInstance', testInstanceSchema);
