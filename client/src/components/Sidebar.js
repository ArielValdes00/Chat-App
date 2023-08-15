import React, { useState, useEffect } from 'react';
import { ChatState } from '@/context/ChatProvider';
import Loader from '../../public/icons/loader.gif';
import Image from 'next/image';
import { getAllUsers, selectChat } from '@/utils/apiChats';

const Sidebar = ({ toast }) => {
    const [usersResult, setUsersResult] = useState([]);
    const [loader, setLoader] = useState(false);
    const { user, setSelectedChat, chats, setChats, toggleShowContacts, toggleShowSideBar } = ChatState();

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoader(true);
                const data = await getAllUsers(user);
                setLoader(false);
                setUsersResult(data);
            } catch (error) {
                console.log(error);
            }
        };
        getUsers();
    }, [])

    const accessChat = async (userId) => {
        if (userId === chats._id) {
            toast.error('The user has already been added')
        } else {
            try {
                const data = await selectChat(userId, user);
                setChats([...chats, data]);
                setSelectedChat(data);
                toggleShowSideBar();
                toggleShowContacts();
            } catch (error) {
                console.log(error)
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-white z-40">
            <div className='absolute h-[545px] flex flex-col overflow-y-auto flex-grow bg-white z-10 relative'>
                {loader ? (
                    <div className='flex justify-center items-center'>
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
