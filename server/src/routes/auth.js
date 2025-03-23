import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import { User } from '../models/User.js';
import {
    registerValidation,
    loginValidation,
} from '../validators/authValidators.js';

const authRouter = Router();

// @route POST /api/register
// @desc Register a new user
// @access Public

authRouter.post('/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    try {
        const { user_name, first_name, last_name, password, email, address } =
            req.body;

        // Check if same username or email exists
        let user = await User.findOne({ $or: [{ email }, { user_name }] });
        if (user) {
            return res
                .status(400)
                .json({ msg: 'Username or email already exists' });
        }

        // Create a new user
        user = new User({
            user_name,
            first_name,
            last_name,
            password,
            email,
            address,
        });

        // Save user to database
        await user.save();
        console.log(`${user_name} registered successfully`);
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Error occured while user registration: ', err.message);
        res.status(500).send('Server Error!');
    }
});

// @route POST /api/login
// @desc Authenticate an existing user and generate token
// @access Public
authRouter.post('/login', loginValidation, async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_name, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ user_name });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Match password

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token

        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Error occurred during login: ', err);
        res.status(500).send('Server Error!');
    }
});

export default authRouter;
