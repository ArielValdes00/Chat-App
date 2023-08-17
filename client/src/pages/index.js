import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { useRouter } from "next/router";
import ForgotPassword from "@/components/ForgotPassword";
import useBooleanState from "@/hooks/useBooleanState";

export default function Home() {
    const [changeForm, setChangeForm] = useState(false);
    const [showForgotPassword, toggleShowForgotPassword] = useBooleanState(false); 
    const router = useRouter();

    const handleChangeForm = () => {
        setChangeForm(!changeForm);
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (userInfo) {
            router.push("/chat")
        }
    }, []);

    return (
        <div className="h-screen bg-gray-100 grid place-items-center overflow-hidden">
            <AnimatePresence mode='wait'>
                {showForgotPassword ? (
                    <motion.div
                        key="forgotPassword"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ForgotPassword toggleShowForgotPassword={toggleShowForgotPassword}/>
                    </motion.div>
                ) : (
                    <motion.div
                        key={changeForm ? "register" : "login"}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {changeForm ? (
                            <Register handleChange={handleChangeForm} />
                        ) : (
                            <Login handleChange={handleChangeForm} toggleShowForgotPassword={toggleShowForgotPassword} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
