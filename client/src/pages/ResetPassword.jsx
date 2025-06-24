import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {

    const URL = process.env.REACT_APP_BASE_URL;

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
	// const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
        const resetInfo = { token, password }

		try {
            setIsLoading(true);
			// await resetPassword(token, password);
            const response = await fetch(`${URL}/auth/reset-password/${token}`, {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resetInfo),
            });
            const res = await response.json();
            if(res.success){
                toast.success(res.message);
                setIsLoading(false);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                return navigate(`/login`);
            }
            else{
                setIsLoading(false);
                toast.error(res.message);
            }

		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};



    

	return (
		<div className="flex justify-center items-center h-screen bg-slate-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
            >
                <div className='p-8'>
                    <h2 className='text-3xl font-normal mb-6 text-center bg-gradient-to-r from-red-600 to-red-700 text-transparent bg-clip-text'>
                        Reset Password
                    </h2>
                    {/* {error && <p className='text-red-500 text-sm mb-4'>{error}</p>} */}
                    {/* {message && <p className='text-green-500 text-sm mb-4'>{message}</p>} */}

                    <form onSubmit={handleSubmit}>
                        <Input
                            icon={Lock}
                            type='password'
                            placeholder='New Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Input
                            icon={Lock}
                            type='password'
                            placeholder='Confirm New Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                            type='submit'
                            disabled={isLoading}
                        > 
                            {isLoading ? "Resetting..." : "Set New Password"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
	);
};
export default ResetPassword;