import React, { useState } from 'react';
import Input from '@/components/Input';
import { register } from '@/utils/apiChats';
import Image from 'next/image';
import Loader from '../../public/icons/loader.gif';
import Eye from '../../public/icons/eye.png';
import EyeSlash from '../../public/icons/eye-slash.png';
import { isValidName, isValidEmail, isValidPassword } from '@/utils/validation';
import { useRouter } from 'next/router';

const Register = ({ handleChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
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
        if (
            isValidName(form.name) &&
            isValidEmail(form.email) &&
            isValidPassword(form.password) &&
            form.password === form.confirmPassword
        ) {
            setIsLoading(true);
            try {
                const res = await register(form.name, form.email, form.password);
                localStorage.setItem('userInfo', JSON.stringify(res));
                setTimeout(() => {
                    setIsLoading(false);
                    router.push("/chat");
                }, 2000);
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
            <div className="text-center mx-auto max-w-lg xl:max-w-xl px-4">
                <h1 className="text-6xl lg:text-7xl font-bold text-blue-600 mb-5 mx-14">REGISTER</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center shadow-xl rounded-md max-w-lg bg-white mx-auto py-5 px-4">
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
                    <Image
                        src={!showPassword1 ? EyeSlash : Eye}
                        height={20}
                        width={20}
                        alt='Show Password'
                        onClick={() => setShowPassword1(!showPassword1)}
                        className='absolute right-3 top-[37px]'
                    />
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
                    <Image
                        src={!showPassword2 ? EyeSlash : Eye}
                        height={20}
                        width={20}
                        alt='Hide Password'
                        onClick={() => setShowPassword2(!showPassword2)}
                        className='absolute right-3 top-[37px]'
                    />
                </div>
                <button
                    type="submit"
                    className="w-full my-2 py-2 bg-blue-600 rounded-md shadow text-white text-xl font-bold"
                >
                    {isLoading ? (
                        <div className='flex items-center justify-center'>
                            <Image src={Loader} height={26} width={26} alt='Loading' />
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <span>Register</span>
                    )}
                </button>
                <p className="my-1">Already have an account?</p>
                <button
                    type='button'
                    onClick={handleChange}
                    className="w-full mt-2 py-2 bg-green-500 rounded-md shadow text-white font-bold text-lg text-center">
                    Log In
                </button>
            </form>
        </div>
    )
}

export default Register