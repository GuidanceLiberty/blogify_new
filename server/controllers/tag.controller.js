import { Tag } from "../models/Tag.js";

export const getTag = async(req, res) => {
    try {
        const tag = await Tag.find();
        if (tag) {
            return res.status(200).json({
                success: true, message: 'Tag found successfully',
            });
        }
        return res.status(200).json({
            success: false, message: 'No tag found'
        });
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}