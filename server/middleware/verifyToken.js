import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const verifyToken = async(req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization){
        return res.status(401).json({
            success: false, message: "unauthorized - no or invalid token provided"
        });
    }
    const token = authorization.split(' ') [1];

    try {
        const {_id} = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({_id}).select('_id');
        next();
    } catch (error) {
        console.log("Error while verifying token", error);
        return res.status(401).json({
            success: false, message: "Request not authorized error"
        });
    }
};