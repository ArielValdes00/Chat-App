import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "@/components/Login";
import Register from "@/components/Register";
import ForgotPassword from "@/components/ForgotPassword";
import useBooleanState from "@/hooks/useBooleanState";
import { Cookies } from "js-cookie";

export default function Home() {
    const [changeForm, setChangeForm] = useState(false);
    const [showForgotPassword, toggleShowForgotPassword] = useBooleanState(false);

    const handleChangeForm = () => {
        setChangeForm(!changeForm);
    };

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
                        <ForgotPassword toggleShowForgotPassword={toggleShowForgotPassword} />
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

export async function getServerSideProps(context) {
    const { req } = context;
    const { cookies } = req;

    if (cookies.userInfo) {
        return {
            redirect: {
                destination: "/chat",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

