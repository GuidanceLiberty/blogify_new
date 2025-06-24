import { Link, useNavigate } from "react-router-dom";

import authBG from "../assets/images/auth-bg.jpg";
import { FaEnvelope, FaImage, FaUnlockAlt, FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import avatar from '../assets/images/user.png';
import { useFormik } from 'formik'
import { registerSchema } from '../schema'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader } from 'lucide-react';



const Register = () => {

    const URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const [photo, setPhoto] = useState(avatar);
    const [file, setFile] = useState(null);


    const onSubmit = async(values, actions) => {
        handleUpload();

        try {
            const response = await fetch(`${URL}/auth/signup`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, photo }),
            });
            const res = await response.json();
            if(res.success){
                toast.success(res.message);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                actions.resetForm();
                return navigate(`/verify-email`);
            }
            else{
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error occurred while creating account : ", error.message);
            console.log("Error occurred while creating account : ", error.message);
        }
    }


  // UPLOAD PHOTO
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPhoto(e.target.value);
  };

  const handleUpload = async () => {  
    if (!file) { return  }

    const formData = new FormData();
    formData.append('file', file);
    // return alert("Uploading photo : ", photo);

    try {
      const res = await axios.post(`${URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message);
    } catch (err) {
      toast.error('Upload failed');
    }

  };



    const { values, touched, isSubmitting, errors, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            photo: "",
        },
        validationSchema: registerSchema,
        onSubmit
    })




  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
    
    {/* Left side - Image */}
    <div className="hidden md:block md:w-1/2">
      <img src={authBG} alt="auth bg image" className="w-full h-full object-cover" />
    </div>

    {/* Right side - Form */}
    <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-12">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-2xl font-light tracking-wide text-center text-primary mb-8">
          Create New Account
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex flex-col mb-6">
            <label htmlFor="name" className="label flex items-center gap-2">
              <FaUserPlus />
              <span>Full Name <span className="text-red-500">*</span></span>
            </label>
            {touched.name && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <input
              type="text"
              id="name"
              placeholder="Enter Full Name"
              className="mt-1 px-3 py-2 border rounded text-sm text-gray-700 placeholder-gray-400"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col mb-6">
            <label htmlFor="email" className="label flex items-center gap-2">
              <FaEnvelope />
              <span>Email <span className="text-red-500">*</span></span>
            </label>
            {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <input
              type="text"
              id="email"
              placeholder="Enter Email"
              className="mt-1 px-3 py-2 border rounded text-sm text-gray-700 placeholder-gray-400"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="label flex items-center gap-2">
              <FaUnlockAlt />
              <span>Password <span className="text-red-500">*</span></span>
            </label>
            {touched.password && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              className="mt-1 px-3 py-2 border rounded text-sm text-gray-700 placeholder-gray-400"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col mb-6">
            <label htmlFor="photo" className="label flex items-center gap-2">
              <FaImage />
              <span>Profile Photo</span>
            </label>
            <input
              type="file"
              id="photo"
              accept=".png, .jpeg, .jpg, .gif"
              className="mt-1 px-3 py-2 border rounded text-sm text-gray-700"
              onChange={handleFileChange}
            />
          </div>

          <Link to="/forget-password" className="text-sm text-right text-primary block mb-4">
            Forgot password?
          </Link>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign Up
              </span>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">Login now</Link>
          </p>
        </form>
      </div>
    </div>
  </div>
</main>

      
  );
};

export default Register;