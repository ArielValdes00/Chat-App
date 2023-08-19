import React, { useState } from 'react';
import Image from 'next/image';
import LogoText from '../../public/icons/chatify-text.png';
import LogoIcon from '../../public/icons/chatify-logo.png';
import LogoBar from '../../public/icons/chatify-bar.png';
import { resetPasswordRequest } from '@/utils/apiChats';
import { isValidEmail } from '@/utils/validation';
import useBooleanState from '@/hooks/useBooleanState';
import Loader from '../../public/icons/loader.gif';

const ForgotPassword = ({ toggleShowForgotPassword }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, toggleIsLoading] = useBooleanState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleIsLoading();
        if (!isValidEmail(email)) {
            setMessage("Invalid Format")
            setTimeout(() => setMessage(""), 4000);
            return;
        } else {
            try {
                const response = await resetPasswordRequest(email);
                console.log("resetPasswordRequest response:", response);
                setMessage(response.message);
            } catch (error) {
                setMessage("An error occurred. Please try again later.");
            } finally {
                toggleIsLoading();
            }
        }
    };

    return (
        <div className="px-5">
            <div className="text-center mx-auto max-w-lg xl:max-w-xl px-4">
                <div className='flex items-center justify-center gap-2 mb-3'>
                    <Image src={LogoIcon} height={60} width={60} alt='Chatify' />
                    <Image src={LogoBar} height={5} width={5} alt='Chatify' />
                    <Image src={LogoText} height={226} width={226} alt='Chatify' className='mt-2' />
                </div>
                <p className="text-3xl mb-5">Forgot Your Password?</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center shadow-xl rounded-md max-w-lg bg-white mx-auto py-5 px-4">
                <div className="w-full">
                    <label className="ms-1 block text-gray-700 text-sm font-bold mb-2" htmlFor='email'>
                        Enter your Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="Your Email"
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-3 py-2 rounded-md focus:outline-blue-400 border'
                    />
                    {message && <p className={`ms-1 text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full p-3 py-2 bg-blue-600 rounded-md shadow text-white text-xl font-bold hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className='flex items-center gap-2 justify-center'>
                            <Image src={Loader} height={26} width={26} alt='Loading' loading='eager'/>
                            <span>Sending...</span>
                        </div>
                    ) : (
                        <span>Send reset link</span>
                    )}
                </button>
                <button
                    type="button"
                    className="w-full p-3 py-2 bg-neutral-800 rounded-md shadow text-white text-xl font-bold hover:bg-neutral-900"
                    onClick={() => toggleShowForgotPassword()}
                >
                    Return to Login
                </button>
            </form>
        </div>
    )
}

export default ForgotPassword;
