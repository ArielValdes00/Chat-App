import { ChatState } from '@/context/ChatProvider'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import User from '../../public/icons/user.png';
import Logout from '../../public/icons/logout.png';
import Modal from './Modal.js';
import { useRouter } from 'next/router';

const Navbar = () => {
    const { user } = ChatState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false)
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
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
        <div className='py-3 border-b'>
            {showModal && <Modal handleCloseModal={handleCloseModal} userInfo={user} />}
            {user && (
                <div className='flex items-center justify-between px-4'>
                    <div>
                        <p className='font-extrabold text-4xl text-blue-600'>CHATIFY</p>
                    </div>
                    <div className='flex items-center gap-3 profile-container'>
                        <div onClick={() => setIsMenuOpen(true)} className='flex gap-2 items-center relative cursor-pointer'>
                            <img src={user.picture} alt={user.name} className='rounded-full profile-img-user' />
                            <p className='font-semibold text-xl capitalize hidden md:block'>{user.name}
                                <span className='ms-2 text-sm'>▼</span>
                            </p>
                        </div>
                        {isMenuOpen && (
                            <ul className='absolute right-5 top-12 mt-2 bg-white text-black rounded-md border z-40 shadow-lg'>
                                <div className='flex items-center gap-3 px-5 lg:px-7 py-2 cursor-pointer hover:bg-gray-100' onClick={handleOpenModal}>
                                    <Image src={User} height={16} width={16} alt='User'></Image>
                                    <span>My Profile</span>
                                </div>
                                <div className='flex items-center gap-3 px-5 lg:px-7 py-2 cursor-pointer hover:bg-gray-100' onClick={handleLogout}>
                                    <Image src={Logout} height={16} width={16} alt="Logout"></Image>
                                    <span>Logout</span>
                                </div>
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar