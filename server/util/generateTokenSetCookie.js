import jwt from 'jsonwebtoken';


export const generateTokenSetCookie = (res, userId) => {
    const token = jwt.sign({ userId},
         process.env.JWT_SECRET, 
         {expiresIn: '2d'})

         res.cookie("token", token, 
            {
                httpOnly: true, 
                secure: process.env.ENV_MODE === 'production',
                samSite: 'strict',
                maxAge : 7 * 24 * 60 * 100  

            });


            return token;
}