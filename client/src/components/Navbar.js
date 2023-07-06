import { ChatState } from '@/context/ChatProvider'
import Image from 'next/image';
import React, { useState } from 'react';
import Search from '../../public/icons/search.png';
import Notification from '../../public/icons/notification.png';
import User from '../../public/icons/user.png';
import Logout from '../../public/icons/logout.png';
import Modal from './Modal';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar.js';

const Navbar = () => {
    const { user } = ChatState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const router = useRouter();

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false)
    };

    const handleCloseSidebar = () => {
        setShowSidebar(false)
    };
    const handleOpenSideBar = () => {
        setShowSidebar(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        router.push("/");
    };

    return (
        <div className='p-3 border-b'>
            {showSidebar && <Sidebar handleCloseSidebar={handleCloseSidebar} />}
            {showModal && <Modal handleCloseModal={handleCloseModal} user={user}/>}
            {user && (
                <div className='grid grid-cols-3'>
                    <div onClick={handleOpenSideBar} className="flex items-center gap-1 md:gap-3 bg-white rounded-full sm:w-2/3 md:w-2/3 lg:w-1/2 border ps-3 p-1">
                        <Image src={Search} height={20} width={20} alt="Search" />
                        <input
                            className="outline-none placeholder-gray-500 w-2/3"
                            type="text"
                            placeholder="Search Users"
                            disabled
                        />
                    </div>
                    <p className='flex items-center justify-center font-extrabold text-2xl'>CHATIFY</p>
                    <div className='flex items-center gap-3 ml-auto'>
                        <Image src={Notification} height={20} width={20} alt="Notification" className='me-2' />
                        <div onClick={handleMenuToggle} className='flex gap-2 items-center relative cursor-pointer'>
                            <img src={user.picture} height={25} width={25} alt={user.name} className='rounded-full' />
                            <p className='font-semibold text-lg capitalize'>{user.name}
                                <span className='ms-2 text-sm'>▼</span>
                            </p>
                        </div>
                        {isMenuOpen && (
                            <ul className='absolute right-2 top-12 mt-2 bg-white text-black rounded-md border'>
                                <div className='flex items-center gap-3 px-5 lg:px-10 py-2 cursor-pointer hover:bg-gray-100' onClick={handleOpenModal}>
                                    <Image src={User} height={16} width={16} alt='User'></Image>
                                    <span>My Profile</span>
                                </div>
                                <div className='flex items-center gap-3 px-5 lg:px-10 py-2 cursor-pointer hover:bg-gray-100' onClick={handleLogout}>
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