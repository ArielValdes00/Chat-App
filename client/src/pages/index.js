import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { useRouter } from "next/router";

export default function Home() {
    const [changeForm, setChangeForm] = useState(false);
    const router = useRouter()
    const handleChangeForm = () => {
        setChangeForm(!changeForm);
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (userInfo) {
            router.push("/chat")
        }
    }, [])

    return (
        <div className="h-screen bg-gray-100 grid place-items-center overflow-hidden">
            <AnimatePresence mode='wait'>
                {!changeForm ? (
                    <motion.div
                        key="login"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: .4 }}
                    >
                        <Login handleChange={handleChangeForm} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: .4 }}
                    >
                        <Register handleChange={handleChangeForm} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
