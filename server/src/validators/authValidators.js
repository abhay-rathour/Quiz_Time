import { body } from 'express-validator';

export const registerValidation = [
    body('user_name', 'Username is required').notEmpty(),
    body('first_name', 'First name is required').notEmpty(),
    body('last_name', 'Last name is required').notEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({
        min: 6,
    }),
    body('email', 'Please include a valid email').isEmail(),
    body('address.street').optional().trim(),
    body('address.city').optional().trim(),
    body('address.state').optional().trim(),
    body('address.postalCode').optional().trim(),
];

export const loginValidation = [
    body('user_name', 'Username is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
];
