import React, { useState, useEffect } from 'react'
import { ChatState } from '@/context/ChatProvider';
import { getSender } from '@/config/config.js';
import Image from 'next/image';
import GroupChatModel from './GroupChatModel';
import Sidebar from './Sidebar.js';
import { getChats, readMessages } from '@/utils/apiChats';
import AllUsers from '../../public/icons/all-users.png';
import Loader from '../../public/icons/loader.gif';

const Contacts = ({ functionShowContact }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { setSelectedChat, user, chats, setChats, selectedChat, notifications, showSideBar, setLoader, loader } = ChatState();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        if (user && user.token) {
            const fetchChats = async () => {
                try {
                    setLoader(true);
                    const chatsData = await getChats(user);
                    const filteredChats = chatsData.filter((chat) => {
                        if (chat.deletedBy === null) {
                            return true;
                        }
                        setLoader(false);
                        return !chat.deletedBy.includes(user._id);
                    });
                    setChats(filteredChats);
                } catch (error) {
                    console.log(error)
                }
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

    return (
        <div className='h-full overflow-y-auto'>
            {showModal && <GroupChatModel handleCloseModal={handleCloseModal} />}
            {showSideBar ? <Sidebar /> : (
                <div>
                    <div onClick={handleOpenModal} className='border-b py-[16px] flex items-center justify-center lg:justify-start lg:ps-4 gap-3 hover:bg-gray-100 cursor-pointer'>
                        <Image src={AllUsers} height={30} width={30} loading="eager" alt='Add Group' />
                        <p className='mt-1 font-semibold text-lg'>New Group Chat</p>
                    </div>
                    {loader ?
                        <div className='h-[400px] flex justify-center items-center'>
                            <Image src={Loader} height={30} width={30} alt='Loading' className='mx-auto flex items-center' />
                        </div>
                        :
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
                        ))}
                </div>
            )}
        </div >
    );
}

export default Contacts