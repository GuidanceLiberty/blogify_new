import { Link, useNavigate } from "react-router-dom";
import authBG from "../assets/images/auth-bg.jpg";
import { FaEnvelope, FaUnlockAlt } from "react-icons/fa";
import { useFormik } from "formik"
import { loginSchema } from "../schema";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";




const Login = () => {
  const URL = process.env.REACT_APP_BASE_URL;

const navigate = useNavigate();

const onSubmit = async(values, actions) => {
    let res;  

    try {
       const response = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(values),
       });
       res = await response.json(); 
       if(!res.success){
        return toast.error(res.message);
       }
       localStorage.setItem('user', JSON.stringify(res.user));
       toast.success(res.message);
       await new Promise((resolve) => {
        setTimeout(resolve, 3500)

       });

       actions.resetForm();
       return navigate('/');

    } catch (error) {
      toast.error("Error occured while trying to login : ", error.message);
      console.log("Error occured while trying to login : ", error.message);  
    }
}

const { values, touched, isSubmitting, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
        email: "",
        password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
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
          Login
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="flex flex-col mb-6">
            <label htmlFor="email" className="label flex items-center gap-2">
              <FaEnvelope />
              <span>Email <span className="text-red-500">*</span></span>
            </label>
            {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <input
              type="text"
              id="email"
              placeholder="Enter email"
              className="mt-1 px-3 py-2 border rounded text-sm text-gray-700 placeholder-gray-400"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="label flex items-center gap-2">
              <FaUnlockAlt />
              <span>Password <span className="text-red-500">*</span></span>
            </label>
            {touched.password && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              className="mt-1 px-3 py-2 border rounded text-sm text-gray-700 placeholder-gray-400"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <Link to="/forgot-password" className="text-sm text-gray-500 mb-4 block text-right">
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
                Sign In
              </span>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium">Register now</Link>
          </p>
        </form>
      </div>
    </div>
  </div>
    </main>

      
  );
};

export default Login;
