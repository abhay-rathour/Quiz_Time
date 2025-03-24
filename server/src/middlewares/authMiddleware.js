import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded.user; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};

export default authMiddleware;
