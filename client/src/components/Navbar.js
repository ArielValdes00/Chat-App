import { ChatState } from '@/context/ChatProvider'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Notification from '../../public/icons/notification.png';
import User from '../../public/icons/user.png';
import Logout from '../../public/icons/logout.png';
import Modal from './Modal.js';
import { useRouter } from 'next/router';
import { getSender } from '@/config/config';

const Navbar = () => {
    const { user, notifications, setSelectedChat, setNotifications, handleShowContacts } = ChatState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
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
    const clickedNotifications = (notif) => {
        handleShowContacts()
        setSelectedChat(notif.chat);
        setNotifications(notifications.filter((n) => n !== notif));
    }
    const handleOutsideClick = (e) => {
        if (e.target.closest(".notification-container, .profile-container") === null) {
            setShowNotifications(false);
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
        <div className='p-3 border-b'>
            {showModal && <Modal handleCloseModal={handleCloseModal} userInfo={user} />}
            {user && (
                <div className='grid grid-cols-3'>
                    <div className='flex items-center'>
                        <div className='relative notification-container' onClick={() => setShowNotifications(true)}>
                            <Image src={Notification} height={25} width={25} alt="Notification" />
                            {notifications.length > 0 &&
                                <span className='flex justify-center items-center text-sm p-[11px] rounded-full bg-red-700 text-white absolute top-[-5px] left-4 h-[4px] w-[4px]'>{notifications.length}</span>
                            }
                            <div className={`absolute w-[210px] mt-1 bg-white text-black ${showNotifications || !notifications && "border"} rounded-md shadow-lg`}>
                                {showNotifications && notifications.map((notif) => (
                                    <div
                                        key={notif._id}
                                        onClick={() => clickedNotifications(notif)}
                                        className=' hover:bg-gray-100 cursor-pointer border-b'>
                                        <div className='p-2'>
                                            {notif.chat.isGroupChat
                                                ? (
                                                    <div className='flex items-center gap-3'>
                                                        <img src={notif.chat.picture} className='profile-img rounded-full' />
                                                        <p className='font-semibold text-sm'>{`New Message From ${notif.chat.chatName}.`}</p>
                                                    </div>
                                                )
                                                : (
                                                    <div className='flex items-center gap-3'>
                                                        <img src={getSender(user, notif.chat.users).picture} className='profile-img rounded-full' />
                                                        <p className='font-semibold text-sm'>{`New Message From ${getSender(user, notif.chat.users).name}.`}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className='flex items-center justify-center font-extrabold text-4xl text-blue-600'>CHATIFY</p>
                    <div className='flex items-center gap-3 ml-auto profile-container'>
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