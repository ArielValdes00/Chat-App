import { ChatState } from '@/context/ChatProvider'
import Image from 'next/image';
import React, { useState } from 'react';
import Notification from '../../public/icons/notification.png';
import User from '../../public/icons/user.png';
import Logout from '../../public/icons/logout.png';
import Modal from './Modal';
import { useRouter } from 'next/router';
import { getSender } from '@/config/config';

const Navbar = () => {
    const { user, notifications, setSelectedChat } = ChatState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
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

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        router.push("/");
    };


    return (
        <div className='p-3 border-b'>
            {showModal && <Modal handleCloseModal={handleCloseModal} userInfo={user} />}
            {user && (
                <div className='grid grid-cols-3'>
                    <div className='flex items-center'>
                        <div className='relative'>
                            <Image src={Notification} height={25} width={25} alt="Notification" />
                            <span className='flex justify-center items-center text-sm p-[11px] rounded-full bg-red-700 text-white absolute top-[-5px] left-4 h-[4px] w-[4px]'>1</span>
                            {notifications && notifications.map((notif) => (
                                <div key={notif._id} onClick={() => { setSelectedChat(notif) }}>
                                    {notif.chat.isGroup
                                        ? `New Message In ${notif.chat.chatName}`
                                        : `New Message In ${getSender(user, notif.chat.users).name}`
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className='flex items-center justify-center font-extrabold text-4xl text-blue-600'>CHATIFY</p>
                    <div className='flex items-center gap-3 ml-auto'>
                        <div onClick={handleMenuToggle} className='flex gap-2 items-center relative cursor-pointer'>
                            <img src={user.picture} height={27} width={27} alt={user.name} className='rounded-full' />
                            <p className='font-semibold text-xl capitalize'>{user.name}
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