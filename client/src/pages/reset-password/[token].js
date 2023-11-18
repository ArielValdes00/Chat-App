import { useState } from 'react';
import { useRouter } from 'next/router';
import { resetPassword } from '@/utils/apiChats';
import { isValidPassword } from '@/utils/validation';
import Image from 'next/image';
import LogoIcon from '../../../public/icons/chatify-logo.png';
import LogoBar from '../../../public/icons/chatify-bar.png';
import LogoText from '../../../public/icons/chatify-text.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useBooleanState from '@/hooks/useBooleanState';
import ButtonLoader from '@/components/ButtonLoader';

const ResetPassword = () => {
    const router = useRouter();
    const { token } = router.query;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword1, toggleShowPassword1] = useBooleanState(false);
    const [showPassword2, toggleShowPassword2] = useBooleanState(false);
    const [isLoading, toggleIsLoading] = useBooleanState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleIsLoading();
        if (password !== confirmPassword || !isValidPassword(password)) {
            setMessage('Passwords do not match or do not meet requirements.');
            setTimeout(() => setMessage(""), 4000);
            toggleIsLoading();
            return;
        }
        try {
            const response = await resetPassword(token, password);
            if (response.success) {
                toggleIsLoading();
                setMessage(response.message);
                setTimeout(() => {
                    setMessage("");
                    router.push("/");
                }, 5000);
            }
        } catch (error) {
            setMessage('An error has occurred. Please try again later.');
            toggleIsLoading();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="text-center mx-auto max-w-lg xl:max-w-xl px-4">
                <div className='flex items-center justify-center gap-2 mb-3'>
                    <Image src={LogoIcon} height={60} width={60} alt='Chatify' />
                    <Image src={LogoBar} height={5} width={5} alt='Chatify' />
                    <Image src={LogoText} height={226} width={226} alt='Chatify' className='mt-2' />
                </div>
                <p className="text-3xl mb-5">Reset your password</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 shadow-xl rounded-md w-[70%] sm:w-[50%] md:w-[40%] lg:w-[30%] bg-white mx-auto py-5 px-4">
                <div className="w-full relative">
                    <label className="ms-1 block text-gray-700 text-sm font-bold mb-2" htmlFor='password'>
                        New Password
                    </label>
                    <input
                        type={!showPassword1 ? "password" : "text"}
                        id="password"
                        placeholder='Your new password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full p-3 py-2 rounded-md focus:outline-blue-400 border'
                    />
                    <span
                        onClick={() => toggleShowPassword1()}
                        className='absolute cursor-pointer right-3 top-[35px]'
                    >
                        {!showPassword1 ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                </div>
                <div className="w-full relative">
                    <label className="ms-1 block text-gray-700 text-sm font-bold mb-2" htmlFor='confirmPassword'>
                        Confirm Password
                    </label>
                    <input
                        type={!showPassword2 ? "password" : "text"}
                        id="confirm-password"
                        placeholder='Confirm your password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 py-2 rounded-md focus:outline-blue-400 border mb-1"
                    />
                    <span
                        onClick={() => toggleShowPassword2()}
                        className='absolute cursor-pointer right-3 top-[35px]'
                    >
                        {!showPassword2 ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                    {message && <p className={`ms-1 text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
                </div>
                <ButtonLoader
                    textButton={'Update Password'}
                    textSubmit={'Updating...'}
                    isLoading={isLoading}
                />
            </form>
        </div>
    );
};

export default ResetPassword;
