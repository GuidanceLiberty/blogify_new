import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);  //123456
	const inputRefs = useRef([]);
	const navigate = useNavigate();


    const URL = process.env.REACT_APP_BASE_URL;

	// const { error, isLoading, verifyEmail } = useAuthStore();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let verificationCode = code.join(""); 
		verificationCode = {verificationCode}; //return console.log("CODE : ", verificationCode);
		try {
			const response = await fetch(`${URL}/auth/verify-email`, {
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(verificationCode),
            });
            const res = await response.json();
            if(res.success){
                toast.success(res.message);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                return navigate(`/login`);
            }
            else{
                toast.error(res.message);
            }

		} catch (error) {
			console.log(error);
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

	return (
		<div className="flex justify-center items-center h-screen bg-slate-100">
			<div className='max-w-md w-full bg-gray-500 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='bg-gray-500 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
				>
					<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-red-500 text-transparent bg-clip-text'>
						Verify Your Email
					</h2>
					<p className='text-center text-white mb-6'>Enter the 6-digit code sent to your email address.</p>

					<form  className='space-y-6'>
						<div className='flex justify-between'>
							{code.map((digit, index) => (
								<input
									key={index}
									ref={(el) => (inputRefs.current[index] = el)}
									type='text'
									maxLength='6'
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className='w-12 h-12 text-center text-2xl font-bold bg-gray-600 text-white border-2 border-gray-600 rounded-lg focus:border-red-500 focus:outline-none'
								/>
							))}
						</div>
						{/* {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>} */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type='submit'
							// disabled={isLoading || code.some((digit) => !digit)}
							className='w-full bg-gradient-to-r from-red-400 to-red-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50'
						> Verify Email
							{/* {isLoading ? "Verifying..." : "Verify Email"} */}
						</motion.button>
					</form>
				</motion.div>
			</div>
		</div>
		
	);
};
export default EmailVerificationPage;