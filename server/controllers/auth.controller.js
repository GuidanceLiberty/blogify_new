import { subtle } from "crypto";
import {User} from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateTokenSetCookie } from "../util/generateTokenSetCookie.js";


export const checkAuth = async(req, res) => {
    try {
       const user = await User.findById(req.userId).select("-password")
       if(!user){
        return res.status(400).json({
            success: false, message: "User not found"
       })
       }

       res.status(200).json({
        success: true, message: 'user found'
       })
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}


export const signup = async (req, res) => {
    const {name, email, password, photo} = req.body;
    try {
        if(!name || !email || !password) {
            throw new error('all fields required');
           }

           const userExit =  await User.findOne({email});
           if (userExit) {
            return res.status(400).json({
                success: false, message: 'user with email already exists'
            });
           }

           const hashedPassword = await bcrypt.hash(password, 10);
           const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
           const user = new User({
            name, email, password:hashedPassword, photo, verificationToken
           });

           await user.save();
           res.status(201).json({
            success: true, message: 'Account created successfully',
            user: {...user._doc, password: undefined}
           });
    } catch (error) {
       return res.json({
            success: false, message: error.message
       })
    }
}

export const login = async(req, res) => {
    const {email, password} = req.body;
    try {
       if(!email || !password){
        throw new Error("Email and password required");
       }
       const user = await User.findOne({email});
       if(!user){
        return res.status(400).json({success: false, message: "No user found"});
       }
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if(!isPasswordValid){
        return res.status(400).json({success: false, message: "No user found"});
       }

       generateTokenSetCookie(res, user._id);


       user.lastLogin = new Date();
       await user.save();

       res.status(201).json({
        subtle: true, message: "login succesfull",
        user: {...user._doc, password: undefined}
       })


    } catch (error) {
       return res.status(400).json({
        success: false, message: error.message
       });
    }
}

export const logout = async(req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true, message: "Logout successfully"
    });
}

export const getUsers = async(req, res) => {
    try {
        const users = await User.find();
        if(users){
            return res.status(200).json({
                success: true, message: "Users Found"
        })
            
        }

        return res.status(200).json({
            success: false, message: " No User Found"
    })
        
    } catch (error) {
        console.log(error)
    }
}