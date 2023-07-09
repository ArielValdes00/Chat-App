import React, { useState, useEffect } from 'react'
import { ChatState } from '@/context/ChatProvider';
import { getSender } from '@/config/config.js';
import axios from 'axios';
import AddGroup from '../../public/icons/add-group.png';
import Image from 'next/image';
import GroupChatModel from './GroupChatModel';
import Search from '../../public/icons/search.png';
import Sidebar from './Sidebar.js';

const Contacts = ({ fetchAgain }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats, setShowContacts, showContacts } = ChatState();
    const [showModal, setShowModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(process.env.NEXT_PUBLIC_CHAT_URL, config);
            setChats(data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        if (user && user.token) {
            fetchChats();
        }
    }, [fetchAgain, user]);


    const handleCloseModal = () => {
        setShowModal(false)
    };

    const handleOpenModal = () => {
        setShowModal(true)
    };

    const showChats = (chat) => {
        setSelectedChat(chat);
        setShowContacts(!showContacts);
    };

    const handleCloseSidebar = () => {
        setShowSidebar(false)
    };

    const handleOpenSideBar = () => {
        setShowSidebar(true);
    };


    return (
        <div className='max-h-[100%]'>
            {showSidebar && <Sidebar handleCloseSidebar={handleCloseSidebar} />}
            {showModal && <GroupChatModel handleCloseModal={handleCloseModal} />}
            <div className='border-b'>
                <div onClick={handleOpenSideBar} className="flex items-center justify-center gap-2 border mx-auto p-[5px] px-4 my-[10px] w-[230px] bg-white rounded-full ">
                    <Image src={Search} height={20} width={20} alt="Search" />
                    <input
                        className="outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search Users"
                    />
                </div>
            </div>
            <div onClick={handleOpenModal} className='border-b p-3 flex items-center justify-center gap-3 hover:bg-gray-100 cursor-pointer'>
                <Image src={AddGroup} height={30} width={30} alt='Add Group' />
                <p className='font-bold'>New Group Chat</p>
            </div>
            {chats.map((chat) => (
                <div key={chat._id}
                    onClick={() => showChats(chat)}
                    className='flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100'
                >
                    <img src={getSender(loggedUser, chat.users).picture}
                        height={40}
                        width={40}
                        alt={getSender(loggedUser, chat.users).name}
                        className='rounded-full'
                    />
                    <div>
                        <p className='text-lg capitalize'>
                            {!chat.isGroupChat
                                ? getSender(loggedUser, chat.users).name
                                : chat.chatName
                            }
                        </p>
                        {chat.latestMessage && (
                            <p className='text-sm'>
                                <b>{chat.latestMessage.sender.name} : </b>
                                {chat.latestMessage.content.length > 50
                                    ? chat.latestMessage.content.substring(0, 51) + "..."
                                    : chat.latestMessage.content}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Contacts