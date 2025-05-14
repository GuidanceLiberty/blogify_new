import jwt from 'jsonwebtoken';

export const verifyToken = async(req, resizeBy, next) => {
    const token = req?.cookies?.token;
    if(!token){
        return res.status(401).json({
            success: false, message: "unauthorized - no token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                success: false, message: "unauthorized - no token provided"
            });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Error while verifying token");
        return res.status(500).json({
            success: false, message: "Sever error"
        })
    }
} 