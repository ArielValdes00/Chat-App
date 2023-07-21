import React from 'react';
import axios from 'axios';
import { ChatState } from '@/context/ChatProvider';

const Sidebar = ({searchResult, setSearchResult, setSearch}) => {
    
    const { user, setSelectedChat, chats, setChats } = ChatState();

    const accessChat = async (userId) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}`, { userId }, config);
            console.log(data)
            setChats([...chats, data]);
            console.log(chats)
            setSelectedChat(data);
            setSearch('');
            setSearchResult([]);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="flex flex-col bg-white z-40">
            <div className='absolute bg-white z-10 relative'>
                    {searchResult?.map((user) => (
                        <div
                            key={user._id}
                            className='flex items-center gap-3 p-1 py-2 ps-3 border-b hover:bg-gray-100 cursor-pointer'
                            onClick={() => accessChat(user._id)}
                        >
                            <img src={user.picture} height={40} width={40} alt={user.name} className='rounded-full profile-img-contacts' />
                            <div>
                                <p className='capitalize text-lg'>{user.name}</p>
                                <p className='text-sm'><strong>Email: </strong>{user.email}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Sidebar;
