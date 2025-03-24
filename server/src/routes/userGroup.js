import express from 'express';
import { body, validationResult } from 'express-validator';
import { UserGroupM2M } from '../models/UserGroupM2M.js';
import { User } from '../models/User.js';
import { Group } from '../models/Group.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const userGroupRouter = express.Router();

// @route POST /api/user-group/request/:groupId
// @desc User sends a join request to a group using 'groupId'
// @access Authenticated User
userGroupRouter.post(
    '/request/:groupId',
    authMiddleware,
    [
        body('role')
            .isIn(['assessor', 'manager', 'admin'])
            .withMessage(
                "Invalid role. Choose from 'assessor', 'manager', 'admin'"
            ),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { role } = req.body;
            const userId = req.user.id; // Extract user from token
            const { groupId } = req.params;

            // Check if group exists
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ msg: 'Group not found' });
            }

            // Check if the user already has a membership record
            const existingMembership = await UserGroupM2M.findOne({
                user: userId,
                group: groupId,
            });
            if (existingMembership) {
                return res.status(400).json({
                    msg: 'You have already requested to join or are a member of this group',
                });
            }

            // Create a join request
            const newRequest = new UserGroupM2M({
                user: userId,
                group: groupId,
                role,
                membership_status: 'pending', // Default status for requests
            });

            await newRequest.save();
            res.status(201).json({
                msg: 'Group join request sent successfully',
                request: newRequest,
            });
        } catch (error) {
            console.error('Error sending join request:', error.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route POST /api/user-group/add/:groupId
// @desc Add a user to a group'groupId' by user_name
// @access Authenticated group owner only
userGroupRouter.post(
    '/add/:groupId',
    authMiddleware,
    [
        body('user_name', 'Username is required').notEmpty(),
        body('role')
            .isIn(['assessor', 'manager', 'admin'])
            .withMessage(
                "Invalid role. Choose from 'assessor', 'manager', 'admin'"
            ),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { user_name, role } = req.body;
            const ownerId = req.user.id; // Extract owner from token
            const { groupId } = req.params;

            // Check if group exists and verify ownership
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ msg: 'Group not found' });
            }
            if (group.owner.toString() !== ownerId) {
                return res
                    .status(403)
                    .json({ msg: 'Only the group owner can add members' });
            }

            // Find user by username
            const user = await User.findOne({ user_name });
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // Check if the user is already a member
            const existingMembership = await UserGroupM2M.findOne({
                user: user._id,
                group: groupId,
            });
            if (existingMembership) {
                return res
                    .status(400)
                    .json({ msg: 'User is already a member of this group' });
            }

            // Add user to group
            const newMember = new UserGroupM2M({
                user: user._id,
                group: groupId,
                role,
                membership_status: 'approved', // Directly approved by owner
            });

            await newMember.save();

            res.status(201).json({
                msg: 'User added to group successfully',
                member: newMember,
            });
        } catch (error) {
            console.error('Error adding user to group:', error.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route PATCH /api/user-group/approve/:requestId
// @desc Approve/Reject join requests
// @access Authenticated group owner only
userGroupRouter.patch(
    '/:groupId/approve/:requestId',
    authMiddleware,
    [
        body('status')
            .isIn(['approved', 'rejected'])
            .withMessage("Status must be either 'approved' or 'rejected'"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { status } = req.body;
            const ownerId = req.user.id;
            const { groupId, requestId } = req.params;

            // Verify group ownership
            const group = await Group.findById(groupId);
            if (!group) return res.status(404).json({ msg: 'Group not found' });

            if (group.owner.toString() !== ownerId) {
                return res.status(403).json({
                    msg: 'Only the group owner can approve/reject requests',
                });
            }

            // Find and update the membership request
            const membership = await UserGroupM2M.findById(requestId);
            if (!membership || membership.group.toString() !== groupId) {
                return res.status(404).json({ msg: 'Join request not found' });
            }

            if (membership.membership_status !== 'pending') {
                return res
                    .status(400)
                    .json({ msg: 'This request has already been processed' });
            }

            membership.membership_status = status;
            await membership.save();

            res.status(200).json({
                msg: `Request ${status} successfully`,
                membership,
            });
        } catch (error) {
            console.error('Error updating membership status:', error.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route GET /api/user-group/:groupId/members
// @desc Get All members of a group
// @access Authenticated user only

userGroupRouter.get('/:groupId/members', authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        // Verify group exists
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ msg: 'Group not found' });

        // Get members
        const members = await UserGroupM2M.find({
            group: groupId,
            membership_status: 'approved',
        })
            .populate('user', 'user_name first_name last_name email')
            .select('-__v');
        res.status(200).json(members);
    } catch (error) {
        console.error('Error fetching group members:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route GET /api/user-group/:groupId/requests
// @desc Get All members of a group
// @access Authenticated user only

userGroupRouter.get('/:groupId/requests', authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;

        // Verify group exists
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ msg: 'Group not found' });

        // Get requests
        const members = await UserGroupM2M.find({
            group: groupId,
            membership_status: 'pending',
        })
            .populate('user', 'user_name first_name last_name email')
            .select('-__v');
        res.status(200).json(members);
    } catch (error) {
        console.error('Error fetching group join requests:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route DELETE /api/user-group/:groupId/leave
// @desc Leave the group
// @access Authenticated user only
userGroupRouter.delete('/:groupId/leave', authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;
        const membership = await UserGroupM2M.findOneAndDelete({
            group: groupId,
            user: userId,
        });

        if (!membership) {
            return res
                .status(404)
                .json({ msg: 'User is not a member of this group' });
        }

        res.status(200).json({ msg: 'Successfully left the group' });
    } catch (error) {
        console.error('Error leaving group:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route DELETE /api/user-group/:groupId/remove/:userId
// @desc Remove the user from the group
// @access Authenticated group owner only
userGroupRouter.delete(
    '/:groupId/remove/:userId',
    authMiddleware,
    async (req, res) => {
        try {
            const { groupId, userId } = req.params;
            const ownerId = req.user.id;

            // Check if the group exists and verify ownership
            const group = await Group.findById(groupId);
            if (!group) return res.status(404).json({ msg: 'Group not found' });

            if (group.owner.toString() !== ownerId) {
                return res
                    .status(403)
                    .json({ msg: 'Only the owner can remove members' });
            }
            // Remove the user from the group
            const membership = await UserGroupM2M.findOneAndDelete({
                group: groupId,
                user: userId,
            });

            if (!membership) {
                return res
                    .status(404)
                    .json({ msg: 'User not found in the group' });
            }
            res.status(200).json({
                msg: 'User removed from group successfully',
            });
        } catch (error) {
            console.error('Error removing user:', error.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);
export default userGroupRouter;
