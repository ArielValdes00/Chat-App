import React, { useState } from 'react';
import { isValidEmail, isValidPassword } from '@/utils/validation';
import { login } from '@/utils/apiChats';
import Eye from '../../public/icons/eye.png';
import EyeSlash from '../../public/icons/eye-slash.png';
import Image from 'next/image';
import Loader from '../../public/icons/loader.gif';
import { useRouter } from 'next/router';

const Login = ({ handleChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const router = useRouter()

    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidEmail(form.email)) {
            setEmailError("Invalid Format")
            setTimeout(() => setEmailError(""), 4000);
            return;
        } else if (!isValidPassword(form.password)) {
            setPasswordError("Invalid Format")
            setTimeout(() => setPasswordError(""), 4000);
            return;
        }
        try {
            const res = await login(form.email, form.password);
            setIsLoading(true);
            localStorage.setItem('userInfo', JSON.stringify(res));
            setEmailError("");
            setPasswordError("");
            setForm({ email: "", password: "" });
            setTimeout(() => {
                setIsLoading(false);
                router.push("/chat");
            }, 2000);
        } catch (error) {
            if (error.message === "Invalid Email") {
                setEmailError("Invalid email. Please check your email address.");
                setTimeout(() => {
                    setEmailError("");
                }, 2000);
                setPasswordError("");
            } else if (error.message === "Invalid Password") {
                setPasswordError("Invalid password. Please check your password.");
                setTimeout(() => {
                    setPasswordError("");
                }, 2000);
                setEmailError("");
            } else {
                console.log(error)
            }
        }
    }

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    return (
        <div className="px-5">
            <div className="text-center mx-auto max-w-lg xl:max-w-xl px-4">
                <h1 className="text-6xl lg:text-7xl font-bold text-blue-600 mb-2">CHATIFY</h1>
                <p className="text-3xl lg:text-4xl mb-8">Chatify helps you communicate with the people in your life.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center shadow-xl rounded-md max-w-lg bg-white mx-auto py-5 px-4">
                <div className="mb-6 w-full">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={'Email Address'}>
                        Email Address
                    </label>
                    <input
                        type={"email"}
                        placeholder={"Your Email"}
                        onChange={handleInputChange}
                        name={"email"}
                        className='w-full p-3 py-2 rounded-md focus:outline-blue-400 border'
                    />
                    {emailError && <p className="text-red-500 text-sm absolute">{emailError}</p>}
                </div>
                <div className="relative w-full mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={'Password'}>
                        Password
                    </label>
                    <input
                        type={!showPassword ? "password" : "text"}
                        placeholder={"Your Password"}
                        onChange={handleInputChange}
                        name={"password"}
                        className='w-full p-3 py-2 rounded-md focus:outline-blue-400 border mb-1'
                    />
                    <Image
                        src={!showPassword ? EyeSlash : Eye}
                        height={20}
                        width={20}
                        alt='Show Password'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-[37px]'
                    />
                    {passwordError && <p className="text-red-500 text-sm absolute">{passwordError}</p>}
                    <div className='text-end mt-2 me-2'>
                        <a className="font-bold text-sm text-black hover:text-gray-800 underline" href="#">
                            Forgot Password?
                        </a>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full p-3 py-2 bg-blue-600 rounded-md shadow text-white text-xl font-bold mb-2"
                >
                    {isLoading ? (
                        <div className='flex items-center justify-center'>
                            <Image src={Loader} height={26} width={26} alt='Loading' />
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <span>Log in</span>
                    )}
                </button>
                <p className="my-1">
                    Don't have an account?
                </p>
                <button
                    type='button'
                    onClick={handleChange}
                    className="w-full mt-2 p-2 bg-green-500 rounded-md shadow text-white font-bold text-lg text-center">Create a New Account
                </button>
            </form>
        </div>
    )
}

export default Login
