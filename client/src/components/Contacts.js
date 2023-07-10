import React, { useState, useEffect } from 'react'
import { ChatState } from '@/context/ChatProvider';
import { getSender } from '@/config/config.js';
import axios from 'axios';
import AddGroup from '../../public/icons/add-group.png';
import Image from 'next/image';
import GroupChatModel from './GroupChatModel';
import Search from '../../public/icons/search.png';
import Sidebar from './Sidebar.js';

const Contacts = ({ fetchAgain, functionShowContact }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(process.env.NEXT_PUBLIC_CHAT_URL, config);
            setChats(data);
            console.log(chats);
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
        functionShowContact()
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
        <div className='h-[90vh] overflow-y-auto'>
            {search.trim() !== "" && <Sidebar searchResult={searchResult} setSearchResult={setSearchResult} setSearch={setSearch} />}
            {showModal && <GroupChatModel handleCloseModal={handleCloseModal} />}
            <div onClick={handleOpenModal} className='border-b py-[15px] flex items-center justify-center gap-3 hover:bg-gray-100 cursor-pointer'>
                <Image src={AddGroup} height={30} width={30} alt='Add Group' />
                <p className='font-bold'>New Group Chat</p>
            </div>
            <div className='border-b'>
                <div className="flex items-center justify-center gap-2 border mx-auto p-[5px] my-[10px] w-1/2 lg:w-[190px] bg-white rounded-full">
                    <input
                        className="outline-none placeholder-gray-500 lg:w-2/3"
                        type="text"
                        placeholder="Search Users"
                        onChange={handleChangeToggleSearchUsers}
                        value={search}
                    />
                    <button
                        onClick={handleSearch}
                    >
                        <Image src={Search} height={20} width={20} alt="Search" />
                    </button>
                </div>
            </div>
            {chats.map((chat) => (
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
                        {chat.latestMessage && (
                            <p className='text-sm'>
                                <b className='capitalize'>{chat.latestMessage.sender.name}: </b>
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