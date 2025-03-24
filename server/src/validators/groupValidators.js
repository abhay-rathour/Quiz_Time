import { body } from 'express-validator';

export const groupValidation = [
    body('name', 'Group name is mandatory').notEmpty(),
    body('type', "Type must be 'open','closed','private'").isIn([
        'open',
        'closed',
        'private',
    ]),
];
