import * as yup from 'yup';

export const registerSchema = yup.object().shape({
    name: yup.string().min(5, "Minimum of 5 characters required").required("Name Required"),
    email: yup.string().email("Email not valid").required("Email required"),
    password: yup.string().min(6, "Password required minimum of 6 characters").required("password required")
});

export const loginSchema = yup.object().shape({
    email: yup.string().email("Email not valid").required("Email required"),
    password: yup.string().min(6, "Password required minimum of 6 characters").required("password required")
});

export const categorySchema = yup.object().shape({
    name: yup.string().min(5, "Minimum of 5 characters required").required("Name Required"),
    description: yup.string().min(15, "required minimum of 15 characters").required("Description required")
});

export const postSchema = yup.object().shape({
    title: yup.string().min(5, "Minimum of 5 characters required").required("Title Required"),
    body: yup.string().min(15, "required minimum of 15 characters").required("Body required"),
    categories: yup.string().min(5, "required minimum of 5 characters").required("Category is required"),
    author: yup.string().min(24, "required minimum of 24 hexadecimal characters").required("Author required")
});
