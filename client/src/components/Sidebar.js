import React, { useState } from 'react';
import axios from 'axios';
import { ChatState } from '@/context/ChatProvider';
import Image from 'next/image';
import Search from '../../public/icons/search.png';

const Sidebar = ({ handleCloseSidebar }) => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const { user, setSelectedChat, chats, setChats } = ChatState();

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

    const accessChat = async (userId) => {
        console.log(userId);

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}`, { userId }, config);

            if (!chats.find((chat) => chat._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="flex flex-col w-64 absolute border-l left-0 top-0 bg-white z-50">
            <div className='absolute bg-white z-10 relative h-screen'>
                <div className="flex items-center gap-1 rounded-full border gap-3 m-2 py-2 ps-2">
                    <Image src={Search} height={20} width={20} alt="Search" className='ms-1' />
                    <input
                        className="outline-none placeholder-gray-500 w-2/3"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Users"
                    />
                    <button onClick={handleSearch} className='bg-gray-100 rounded-full px-3 py-2 me-2 text-sm'>Search</button>
                </div>
                <div className='mt-5'>
                    {searchResult?.map((user) => (
                        <div
                            key={user._id}
                            className='flex items-center gap-3 p-1 py-2 ps-3 border-b hover:bg-gray-100 cursor-pointer'
                            onClick={() => accessChat(user._id)}
                        >
                            <img src={user.picture} height={40} width={40} alt={user.name} className='rounded-full' />
                            <div>
                                <p className='capitalize'>{user.name}</p>
                                <p className='text-sm'><strong>Email: </strong>{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseSidebar}>
                <div className="absolute inset-0 bg-neutral-800 opacity-75"></div>
            </div>
        </div>
    );
};

export default Sidebar;
