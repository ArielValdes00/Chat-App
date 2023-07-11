import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Contacts from '@/components/Contacts';
import { ChatState } from '@/context/ChatProvider';
import SingleChat from '@/components/SingleChat';

const Chat = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { showContacts, handleShowContacts } = ChatState();
    const useWindowSize = () => {
        const [windowSize, setWindowSize] = useState({
            width: undefined,
            height: undefined,
        });

        useEffect(() => {
            function handleResize() {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }

            window.addEventListener("resize", handleResize);

            handleResize();

            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return windowSize;
    }
    const size = useWindowSize();

    return (
        <div className='max-h-screen flex flex-col overflow-x-hidden'>
            <Navbar />
            <div className='grid grid-cols-5'>
                <motion.div
                    className={`${!showContacts ? "block" : "hidden lg:block"} col-span-5 lg:col-span-1`}
                    initial={size.width < 1024 ? { x: -100, opacity: 0 } : { opacity: 1 }}
                    animate={size.width < 1024 ? { x: !showContacts ? 0 : -100, opacity: !showContacts ? 1 : 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <Contacts fetchAgain={fetchAgain} functionShowContact={handleShowContacts} />
                </motion.div>
                <motion.div
                    className={`${showContacts ? "block" : "hidden lg:block"} col-span-5 lg:col-span-4 border-l`}
                    initial={size.width < 1024 ? { x: 100, opacity: 0 } : { opacity: 1 }}
                    animate={size.width < 1024 ? { x: showContacts ? 0 : 100, opacity: showContacts ? 1 : 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <SingleChat fetchAgain={fetchAgain} functionShowContact={handleShowContacts} setFetchAgain={setFetchAgain} />
                </motion.div>
            </div>
        </div>
    );
};

export default Chat;
