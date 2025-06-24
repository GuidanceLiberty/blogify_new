import Joi from 'joi';

// AUTH

export const signupSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30)  
    // .pattern(new RegExp('^(?=.[a-z])(?=.[A-Z])(?=.\\d)(?=.[\\W_]).+$'))
    .required()
});



export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const postSchema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    slug: Joi.string().min(5).max(50).required(),
    body: Joi.string().min(15).required(),
    categories: Joi.string().min(6).max(30), 
    author: Joi.string().required()  
    // .pattern(new RegExp('^(?=.[a-z])(?=.[A-Z])(?=.\\d)(?=.[\\W_]).+$'))
    .required()
});

export const categorySchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(15).required(),
});


