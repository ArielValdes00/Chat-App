import React, { useState } from 'react';
import { isValidEmail, isValidPassword } from '@/utils/validation';
import { login } from '@/utils/apiChats';
import Image from 'next/image';
import { useRouter } from 'next/router';
import LogoText from '../../public/icons/chatify-text.png';
import LogoIcon from '../../public/icons/chatify-logo.png';
import LogoBar from '../../public/icons/chatify-bar.png';
import useBooleanState from '@/hooks/useBooleanState';
import ButtonLoader from './ButtonLoader';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ handleChange, toggleShowForgotPassword }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [showPassword, toggleShowPassword] = useBooleanState(false);
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
                <div className='flex items-center justify-center gap-2 mb-3'>
                    <Image src={LogoIcon} height={60} width={60} alt='Chatify' />
                    <Image src={LogoBar} height={5} width={5} alt='Chatify' />
                    <Image src={LogoText} height={226} width={226} alt='Chatify' className='mt-2' />
                </div>
                <p className="text-3xl mb-5">Chatify helps you communicate with the people in your life.</p>
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
                    <span
                        onClick={() => toggleShowPassword()}
                        className='absolute right-3 top-[35px]'
                    >
                        {!showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                    {passwordError && <p className="text-red-500 text-sm absolute">{passwordError}</p>}
                    <div className='text-end mt-2 me-2'>
                        <p className="font-bold text-sm text-black hover:text-gray-800 underline cursor-pointer" onClick={() => toggleShowForgotPassword()}>
                            Forgot Password?
                        </p>
                    </div>
                </div>
                <ButtonLoader
                    textButton={'Log In'}
                    textSubmit={'Loading...'}
                    isLoading={isLoading}
                />
                <p className="my-1">
                    Don't have an account?
                </p>
                <button
                    type='button'
                    onClick={handleChange}
                    className="w-full mt-2 p-2 bg-neutral-800 rounded-md shadow text-white font-bold text-lg text-center hover:bg-black">
                    Create a New Account
                </button>
            </form>
        </div>
    )
}

export default Login
