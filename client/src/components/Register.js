import React, { useState } from 'react';
import Input from '@/components/Input';
import { register } from '@/utils/apiChats';
import { isValidName, isValidEmail, isValidPassword } from '@/utils/validation';
import { useRouter } from 'next/router';
import useBooleanState from '@/hooks/useBooleanState';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ButtonLoader from './ButtonLoader';

const Register = ({ handleChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [showPassword1, toggleShowPassword1] = useBooleanState(false);
    const [showPassword2, toggleShowPassword2] = useBooleanState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({
            ...prevState, [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (
            isValidName(form.name) &&
            isValidEmail(form.email) &&
            isValidPassword(form.password) &&
            form.password === form.confirmPassword
        ) {
            try {
                await register(form.name, form.email, form.password);
                location.reload();
                setIsLoading(false);

            } catch (error) {
                setEmailError(error.message)
                setTimeout(() => {
                    setEmailError("")
                }, 2000);
                setIsLoading(false);
            }
        }
    };
    return (
        <div className="px-5">
            <div className="text-center mx-auto max-w-lg xl:max-w-xl px-6 sm:px-16">
                <h1 className="text-6xl lg:text-7xl font-bold text-blue-600 mb-5">REGISTER</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center shadow-xl rounded-md max-w-lg bg-white mx-auto py-5 px-4">
                <Input
                    type={"text"}
                    placeholder={"Your Name"}
                    labelName={"Name"}
                    name={"name"}
                    onChange={handleInputChange}
                    formValue={form.name}
                />
                <div className='relative w-full'>
                    <Input
                        type={"text"}
                        placeholder={"Your Email"}
                        labelName={"Email"}
                        name={"email"}
                        onChange={handleInputChange}
                        formValue={form.email}
                    />
                    {emailError && <p className="text-red-500 text-sm absolute top-[65px]">{emailError}</p>}
                </div>
                <div className="relative w-full">
                    <Input
                        type={!showPassword1 ? "password" : "text"}
                        placeholder={"Your Password"}
                        labelName={"Password"}
                        name={"password"}
                        onChange={handleInputChange}
                        formValue={form.password}
                    />
                    <span
                        onClick={() => toggleShowPassword1()}
                        className='absolute cursor-pointer right-3 top-[35px]'
                    >
                        {!showPassword1 ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                </div>
                <div className="relative w-full">
                    <Input
                        type={!showPassword2 ? "password" : "text"}
                        placeholder={"Confirm Your Password"}
                        labelName={"Confirm Password"}
                        name={"confirmPassword"}
                        onChange={handleInputChange}
                        passwordValue={form.password}
                    />
                    <span
                        onClick={() => toggleShowPassword2()}
                        className='absolute cursor-pointer right-3 top-[35px]'
                    >
                        {!showPassword2 ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                </div>
                <ButtonLoader
                    textButton={'Register'}
                    textSubmit={'Loading...'}
                    isLoading={isLoading}
                />
                <p className="my-1">Already have an account?</p>
                <button
                    type='button'
                    onClick={handleChange}
                    className="w-full mt-2 py-2 bg-neutral-800 rounded-md shadow text-white font-bold text-lg text-center hover:bg-black">
                    Log In
                </button>
            </form>
        </div>
    )
}

export default Register