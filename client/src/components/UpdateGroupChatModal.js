import React, { useState } from 'react';
import CloseModal from '../../public/icons/close-modal.png';
import { ChatState } from '@/context/ChatProvider';
import Image from 'next/image';
import axios from 'axios';
import Delete from '../../public/icons/delete.png';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages, handleCloseModal }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRename = async (e) => {
        e.preventDefault();
        if (!groupChatName) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            console.log(error)
        }
        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
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
            console.log(error)
        }
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            console.log("only admins can remove users")
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
            handleCloseModal()
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
        } catch (error) {
            console.log(error)
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            console.log("user Already in Gruop")
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            console.log("only admins can add someone")
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            console.log(error)
        }
        setGroupChatName("");
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center w-full'>
            <div className='absolute bg-white p-4 rounded-xl shadow-lg z-10 relative w-[400px] md:w-[500px] lg:w-[550px]'>
                <div className='mb-5'>
                    <Image onClick={handleCloseModal}
                        src={CloseModal} height={28}
                        width={28}
                        alt='Close'
                        className='cursor-pointer absolute right-3 top-3'
                    />
                </div>
                <p className='text-center text-2xl font-bold capitalize'>{selectedChat.chatName}</p>
                <div className='flex items-center gap-4 mt-10'>
                    {selectedChat.users.map((user) => (
                        <div
                            key={user._id}
                            className='flex flex-wrap items-center justify-center bg-gray-200 gap-2 rounded-full border px-3 cursor-pointer'>
                            <p className='capitalize'>{user.name}</p>
                            <Image
                                src={Delete}
                                height={10}
                                width={10}
                                alt='Delete'
                                onClick={() => handleRemove(user)}
                            />
                        </div>
                    ))}
                </div>
                <div className='flex flex-col gap-2 mt-5'>
                    <label htmlFor='Chat Name'>Chat Name</label>
                    <div className='flex'>
                        <input
                            onChange={(e) => setGroupChatName(e.target.value)}
                            type='text'
                            placeholder='Your Chat Name'
                            className='border p-2 w-full'
                        />
                        <button
                            onClick={handleRename}
                            type='button'
                            className='border p-2 w-1/4'
                        >Update</button>
                    </div>
                    <label htmlFor='Users'>Add Users</label>
                    <input
                        onChange={(e) => handleSearch(e.target.value)}
                        type='text'
                        placeholder='Add Users'
                        className='border p-2'
                    />

                </div>
                {searchResult?.map((user) => (
                    <div
                        key={user._id}
                        user={user}
                        onClick={() => handleAddUser(user)}
                        className='flex items-center gap-3 p-1 py-2 ps-3 hover:bg-gray-100 cursor-pointer'
                    >
                        <img src={user.picture} height={40} width={40} alt={user.name} className='rounded-full' />
                        <div>
                            <p className='capitalize'>{user.name}</p>
                            <p className='text-sm'><strong>Email: </strong>{user.email}</p>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => handleRemove(user)}
                    type='button'
                    className='mt-2 bg-gray-100 border border-black px-5 mx-auto p-2 rounded-full'>
                    Leave Chat
                </button>
            </div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseModal}>
                <div className="absolute inset-0 bg-neutral-800 opacity-75"></div>
            </div>
        </div>)
}

export default UpdateGroupChatModal