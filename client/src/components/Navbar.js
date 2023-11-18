import { ChatState } from '@/context/ChatProvider';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { BiSolidContact } from "react-icons/bi";
import LogoText from '../../public/icons/chatify-text.png';
import LogoIcon from '../../public/icons/chatify-logo.png';
import Modal from './Modal.js';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import useBooleanState from '@/hooks/useBooleanState';
import { variants } from '@/utils/animations';
import Cookies from 'js-cookie';

const Navbar = ({ functionShowContact }) => {
    const { showSideBar, toggleShowSideBar, showContacts } = ChatState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState([]);
    const [showModal, toggleShowModal] = useBooleanState(false);
    const router = useRouter();

    useEffect(() => {
        const getUser = Cookies.get('userInfo');
        const parsedUser = JSON.parse(getUser);
        setUser(parsedUser);
    }, [router]);

    const showContact = () => {
        toggleShowSideBar();
        if (showContacts) {
            functionShowContact();
        };
    }

    const openMenuProfile = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleLogout = () => {
        Cookies.remove("userInfo");
        router.push("/");
    };

    const handleOutsideClick = (e) => {
        if (e.target.closest(".profile-container") === null) {
            setIsMenuOpen(false)
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className='py-[14px] 2xl:py-6 border-b' aria-hidden="true">
            {showModal && <Modal handleCloseModal={() => toggleShowModal()} userInfo={user} />}
            {user && (
                <div className='grid grid-cols-3 items-center px-3'>
                    <div
                        tabIndex={0}
                        className='mr-auto flex items-center gap-2 2xl:text-xl cursor-pointer bg-blue-600 text-white rounded-full p-2 lg:px-3 lg:pe-4 lg:py-[7px] 2xl:p-4'
                        onClick={showContact}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                showContact();
                            }
                        }}
                    >
                        {showSideBar ? <BiSolidContact size={20} /> : <IoSearch size={20} />}
                        <p className='hidden md:block text-white font-semibold'>{`${showSideBar ? 'Contacts' : 'Search Users'}`}</p>
                    </div>
                    <div className='mt-1 flex items-center justify-center gap-1'>
                        <Image src={LogoIcon} height={40} width={40} alt='Chatify' className='hidden lg:block' />
                        <Image src={LogoText} height={126} width={126} alt='Chatify' />
                    </div>
                    <div className='flex items-center gap-3 profile-container ml-auto'>
                        <div
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    openMenuProfile();
                                }
                            }}
                            onClick={openMenuProfile}
                            className='flex gap-2 items-center cursor-pointer'>
                            <img src={user.picture} alt={user.name} className='rounded-full profile-img-user' />
                            <p className='font-semibold text-xl 2xl:text-2xl capitalize hidden md:block'>
                                {user.name}
                                <span className='ms-2 text-sm'>▼</span>
                            </p>
                        </div>
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={variants}
                                    transition={{ duration: 0.15 }}
                                    className='absolute right-2 top-10 2xl:top-16'
                                >
                                    <div className='absolute right-2 top-3 mt-2 bg-white text-black rounded-md text-[15px] border z-40 shadow-lg'>
                                        <div
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    toggleShowModal();
                                                }
                                            }}
                                            className='flex items-center gap-3 2xl:text-xl px-5 lg:px-7 py-2 cursor-pointer hover:bg-gray-100'
                                            onClick={() => toggleShowModal()}>
                                            <FaUser size={15} />
                                            <span>Profile</span>
                                        </div>
                                        <div
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleLogout();
                                                }
                                            }}
                                            className='flex items-center gap-3 2xl:text-xl px-5 lg:px-7 py-2 cursor-pointer hover:bg-gray-100'
                                            onClick={handleLogout}>
                                            <FiLogOut size={15} />
                                            <span>Logout</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar