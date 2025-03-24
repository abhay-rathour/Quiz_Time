import { Router } from 'express';
import { validationResult } from 'express-validator';

import { Group } from '../models/Group.js';
import { groupValidation } from '../validators/groupValidators.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const groupRouter = Router();

// @route POST /api/group
// @desc Create a new group
// @access Authenticated User

groupRouter.post('/', authMiddleware, groupValidation, async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    try {
        const { name, type } = req.body;

        const owner = req.user.id;

        // Create a new group
        const group = new Group({
            name,
            type,
            owner,
        });

        // Save group to database
        await group.save();
        console.log(`Group ${name} created successfully`);
        res.status(201).json({ msg: 'Group created successfully', group });
    } catch (err) {
        console.error('Error occured while group creation: ', err.message);
        res.status(500).send('Server Error!');
    }
});

// @route GET /api/group/:id
// @desc Get the group details from the group id
// @access Authenticated User
groupRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate(
            'owner',
            'user_name email'
        );
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (err) {
        console.error('Error while fetching group: ', err);
        res.status(500).send('Server Error!');
    }
});

export default groupRouter;
