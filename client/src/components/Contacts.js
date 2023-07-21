import React, { useState, useEffect } from 'react'
import { ChatState } from '@/context/ChatProvider';
import { getSender } from '@/config/config.js';
import axios from 'axios';
import AddGroup from '../../public/icons/add-group.png';
import Image from 'next/image';
import GroupChatModel from './GroupChatModel';
import Search from '../../public/icons/search.png';
import Sidebar from './Sidebar.js';
import { getChats, readMessages } from '@/utils/apiChats';

const Contacts = ({ functionShowContact }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { setSelectedChat, user, chats, setChats, selectedChat, notifications } = ChatState();
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        if (user && user.token) {
            const fetchChats = async () => {
                const chatsData = await getChats(user);
                console.log(chatsData)
                setChats(chatsData)
            };
            fetchChats();
        }
    }, [user, selectedChat, notifications]);


    const handleCloseModal = () => {
        setShowModal(false)
    };

    const handleOpenModal = () => {
        setShowModal(true)
    };

    const showChats = async (chat) => {
        setSelectedChat(chat);
        functionShowContact()
        await readMessages(chat, user)
        await getChats(user)
    };

    const handleChangeToggleSearchUsers = (e) => {
        const value = e.target.value;
        setSearch(value)
    };

    const handleSearch = async () => {
        if (!search) {
            return setSearchResult([]);
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_USER_URL}?search=${search}`, config);
            setSearchResult(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='h-full overflow-y-auto'>
            {showModal && <GroupChatModel handleCloseModal={handleCloseModal} />}
            <div onClick={handleOpenModal} className='border-b py-[15px] flex items-center justify-center lg:justify-start lg:ps-4 gap-3 hover:bg-gray-100 cursor-pointer'>
                <Image src={AddGroup} height={30} width={30} loading="eager" alt='Add Group' />
                <p className='font-bold'>New Group Chat</p>
            </div>
            <div className='border-b py-3 flex items-center justify-center lg:justify-start'>
                <div className="flex items-center bg-gray-100 gap-2 border p-2 mx-3 bg-white rounded-full w-full">
                    <button
                        onClick={handleSearch}
                    >
                        <Image src={Search} height={20} width={20} alt="Search" loading="eager" className='ms-3' />
                    </button>
                    <input
                        className="outline-none placeholder-gray-500 mx-3"
                        type="text"
                        placeholder="Search Users"
                        onChange={handleChangeToggleSearchUsers}
                        value={search}
                    />
                </div>
            </div>
            {search.trim() !== "" ? <Sidebar searchResult={searchResult} setSearchResult={setSearchResult} setSearch={setSearch} /> : (
                chats.map((chat) => (
                    <div key={chat._id}
                        onClick={() => showChats(chat)}
                        className='flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100'
                    >
                        <img
                            src={!chat.isGroupChat ? getSender(loggedUser, chat.users)?.picture : chat.picture}
                            alt={getSender(loggedUser, chat.users)?.name}
                            className='rounded-full profile-img-contacts'
                        />
                        <div>
                            <p className='text-lg capitalize'>
                                {!chat.isGroupChat
                                    ? getSender(loggedUser, chat.users)?.name
                                    : chat.chatName
                                }
                            </p>
                            <div className='flex gap-2'>
                                {chat.hasUnreadMessages && (
                                    <span className='flex justify-center items-center text-sm w-5 h-5 rounded-full bg-blue-600 text-white'>{notifications.length}</span>
                                )}
                                {chat.latestMessage && (
                                    <p className='text-sm'>
                                        {chat.isGroupChat &&
                                            <b className='capitalize'>{chat.latestMessage.sender.name}: </b>
                                        }
                                        {chat.latestMessage.content.length > 40
                                            ? chat.latestMessage.content.substring(0, 41) + "..."
                                            : chat.latestMessage.content}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}

        </div>
    );
}

export default Contacts