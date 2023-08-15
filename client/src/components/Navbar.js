import { ChatState } from '@/context/ChatProvider';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import User from '../../public/icons/user.png';
import Search from '../../public/icons/search.png';
import Logout from '../../public/icons/logout.png';
import ContactsIcon from '../../public/icons/contacts.png';
import LogoText from '../../public/icons/chatify-text.png';
import LogoIcon from '../../public/icons/chatify-logo.png';
import Modal from './Modal.js';
import { useRouter } from 'next/router';
import useBooleanState from '@/hooks/useBooleanState';

const Navbar = ({ functionShowContact }) => {
    const { user, showSideBar, toggleShowSideBar, showContacts } = ChatState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, toggleShowModal] = useBooleanState(false);
    const router = useRouter();

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
        <div className='py-[14px] border-b'>
            {showModal && <Modal handleCloseModal={() => toggleShowModal()} userInfo={user} />}
            {user && (
                <div className='grid grid-cols-3 items-center px-3'>
                    <div className='mr-auto flex items-center gap-2 cursor-pointer bg-blue-600 rounded-full p-2 lg:px-3 lg:pe-4 lg:py-[7px]' onClick={showContact}>
                        <Image src={showSideBar ? ContactsIcon : Search} height={20} width={20} alt='Search Users' />
                        <p className='hidden md:block text-white font-semibold'>{`${showSideBar ? 'Contacts' : 'Search Users'}`}</p>
                    </div>
                    <div className='mt-1 flex items-center justify-center gap-1'>
                        <Image src={LogoIcon} height={40} width={40} alt='Chatify' className='hidden lg:block' />
                        <Image src={LogoText} height={126} width={126} alt='Chatify' />
                    </div>
                    <div className='flex items-center gap-3 profile-container ml-auto'>
                        <div onClick={openMenuProfile} className='flex gap-2 items-center relative cursor-pointer'>
                            <img src={user.picture} alt={user.name} className='rounded-full profile-img-user' />
                            <p className='font-semibold text-xl capitalize hidden md:block'>{user.name}
                                <span className='ms-2 text-sm'>▼</span>
                            </p>
                        </div>
                        {isMenuOpen && (
                            <ul className='absolute right-2 top-12 mt-2 bg-white text-black rounded-md border z-40 shadow-lg'>
                                <div className='flex items-center gap-3 px-5 lg:px-7 py-2 cursor-pointer hover:bg-gray-100' onClick={() => toggleShowModal()}>
                                    <Image src={User} height={16} loading='eager' width={16} alt='User'></Image>
                                    <span>My Profile</span>
                                </div>
                                <div className='flex items-center gap-3 px-5 lg:px-7 py-2 cursor-pointer hover:bg-gray-100' onClick={handleLogout}>
                                    <Image src={Logout} height={16} loading='eager' width={16} alt="Logout"></Image>
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