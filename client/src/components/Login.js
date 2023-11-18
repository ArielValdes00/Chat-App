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
import Cookies from 'js-cookie';

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
        setIsLoading(true);
        if (!form.email || !form.password) {
            setEmailError("Please complete all the fields")
            setPasswordError("Please complete all the fields")
            setIsLoading(false);
            setTimeout(() => {
                setPasswordError("")
                setEmailError("")
            }, 4000);
            return;
        }
        if (!isValidEmail(form.email)) {
            setEmailError("Invalid Format")
            setTimeout(() => setEmailError(""), 4000);
            return;
        }
        if (!isValidPassword(form.password)) {
            setPasswordError("Invalid Format")
            setTimeout(() => setPasswordError(""), 4000);
            return;
        }
        try {
            const res = await login(form.email, form.password);
            setIsLoading(false);
            Cookies.set('chatToken', JSON.stringify(res.token), { expires: 7 });
            Cookies.set('userInfo', JSON.stringify(res), { expires: 7 });

            router.push('/chat');
            setEmailError("");
            setPasswordError("");
            setForm({ email: "", password: "" });
        } catch (error) {
            if (error.message === "Invalid Email") {
                setEmailError("Invalid email. Please check your email address.");
                setTimeout(() => {
                    setEmailError("");
                }, 2000);
                setPasswordError("");
            } else if (error.message) {
                setPasswordError(error.message);
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 shadow-xl rounded-md max-w-lg bg-white mx-auto py-5 px-4">
                <div className="w-full">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={'Email Address'}>
                        Email Address
                    </label>
                    <input
                        type={"email"}
                        placeholder={"Your Email"}
                        onChange={handleInputChange}
                        value={form.email}
                        name={"email"}
                        className='w-full p-3 py-2 rounded-md focus:outline-blue-400 border'
                    />
                    {emailError && <p className="text-red-500 text-sm absolute">{emailError}</p>}
                </div>
                <div className="relative w-full">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={'Password'}>
                        Password
                    </label>
                    <input
                        type={!showPassword ? "password" : "text"}
                        placeholder={"Your Password"}
                        onChange={handleInputChange}
                        value={form.password}
                        name={"password"}
                        className='w-full p-3 py-2 rounded-md focus:outline-blue-400 border mb-1'
                    />
                    <span
                        onClick={() => toggleShowPassword()}
                        className='absolute cursor-pointer right-3 top-[35px]'
                    >
                        {!showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                    {passwordError && <p className="text-red-500 text-sm absolute">{passwordError}</p>}
                </div>
                <p
                    tabIndex={0}
                    className="font-bold ml-auto text-end me-1 text-sm text-black hover:text-gray-800 underline cursor-pointer"
                    onClick={() => toggleShowForgotPassword()}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            e.preventDefault();
                            toggleShowForgotPassword();
                        }
                    }}
                >
                    Forgot Password?
                </p>
                <div>
                    <ButtonLoader
                        textButton={'Log In'}
                        textSubmit={'Loading...'}
                        isLoading={isLoading}
                    />
                    <p className="text-center mt-2">
                        Don't have an account?
                    </p>
                    <button
                        type='button'
                        onClick={handleChange}
                        className="w-full mt-2 p-2 bg-neutral-800 rounded-md shadow text-white font-bold text-lg text-center hover:bg-black">
                        Create a New Account
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login
