import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatState } from '@/context/ChatProvider';
import Loader from '../../public/icons/loader.gif';
import Image from 'next/image';

const Sidebar = () => {
    const [usersResult, setUsersResult] = useState([]);
    const { user, setSelectedChat, chats, setChats, handleShowSideBar, setLoader, loader } = ChatState();

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                setLoader(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_USER_URL}`, config);
                setLoader(false);
                setUsersResult(data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllUsers();
    }, [])


    const accessChat = async (userId) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}`, { userId }, config);
            setChats([...chats, data]);
            setSelectedChat(data);
            handleShowSideBar();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="flex flex-col bg-white z-40">
            <div className='absolute bg-white z-10 relative'>
                {loader ? (
                    <div className='h-[400px] flex justify-center items-center'>
                        <Image src={Loader} loading="eager" height={40} width={40} alt='Loader' className='' />
                    </div>
                ) : (
                    usersResult.map((user) => (
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
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;
