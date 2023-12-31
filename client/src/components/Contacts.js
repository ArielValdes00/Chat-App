import React, { useState, useEffect } from 'react';
import { ChatState } from '@/context/ChatProvider';
import { getSender } from '@/config/config.js';
import GroupChatModel from './GroupChatModel';
import { MdGroupAdd } from "react-icons/md";
import Sidebar from './Sidebar.js';
import { getChats, readMessages } from '@/utils/apiChats';
import { LuLoader2 } from "react-icons/lu";
import useBooleanState from '@/hooks/useBooleanState';

const Contacts = ({ functionShowContact, toast, user }) => {

    const { setSelectedChat, chats, setChats, selectedChat, notifications, showSideBar, setNotifications } = ChatState();
    const [loggedUser, setLoggedUser] = useState(user);
    const [showModal, toggleShowModal] = useBooleanState(false);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (user && user.token) {
            const fetchChats = async () => {
                try {
                    setLoader(true);
                    const chatsData = await getChats(user);
                    const filteredChats = chatsData.filter((chat) => {
                        if (chat.deletedBy === null) {
                            return true;
                        }
                        return !chat.deletedBy.includes(user._id);
                    });
                    setLoader(false);
                    setChats(filteredChats);
                } catch (error) {
                    console.log(error)
                }
            };
            fetchChats();
        }
    }, [user, selectedChat, notifications]);

    const showChats = async (chat) => {
        setNotifications([]);
        setSelectedChat(chat);
        functionShowContact()
        await readMessages(chat, user)
        await getChats(user)
    };

    return (
        <div className='flex flex-col h-full'>
            {showModal && <GroupChatModel handleCloseModal={() => toggleShowModal()} toast={toast} user={user} />}
            {showSideBar ? <Sidebar toast={toast} user={user} /> : (
                <>
                    <div
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                toggleShowModal();
                            }
                        }}
                        onClick={() => toggleShowModal()}
                        className='border-b py-[16px] 2xl:py-7 flex items-center justify-center lg:justify-start lg:ps-4 gap-3 hover:bg-gray-100 cursor-pointer'
                    >
                        <MdGroupAdd size={26} className='text-blue-600' />
                        <p className='mt-1 font-semibold text-lg 2xl:text-xl'>New Group Chat</p>
                    </div>
                    <div className='flex flex-grow flex-col h-[481px] overflow-y-auto'>
                        {loader ?
                            <div className='h-full flex justify-center items-center'>
                                <LuLoader2 size={30} className='animate-spin text-blue-600' />
                            </div>
                            :
                            chats?.map((chat) => (
                                <div
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            showChats(chat);
                                        }
                                    }}
                                    key={chat._id}
                                    onClick={() => showChats(chat)}
                                    className={`flex items-center gap-3 p-3 2xl:py-6 border-b cursor-pointer ${selectedChat?._id === chat._id && 'lg:bg-gray-100'} hover:bg-gray-100`}
                                >
                                    <img
                                        src={!chat.isGroupChat ? getSender(loggedUser, chat.users)?.picture : chat.picture}
                                        alt={getSender(loggedUser, chat.users)?.name}
                                        className='rounded-full profile-img-contacts'
                                    />
                                    <div>
                                        <p className='text-lg 2xl:text-xl capitalize'>
                                            {!chat.isGroupChat
                                                ? getSender(loggedUser, chat.users)?.name
                                                : chat.chatName
                                            }
                                        </p>
                                        <div className='flex gap-2'>
                                            {chat.latestMessage && !chat.latestMessage.deletedBy.includes(user._id) && (
                                                <p className='text-sm'>
                                                    {chat.isGroupChat &&
                                                        <b className='capitalize'>{chat.latestMessage.sender.name}: </b>
                                                    }
                                                    {chat.latestMessage.content.length > (chat.isGroupChat ? 20 - chat.latestMessage.sender.name.length : 20)
                                                        ? <>
                                                            {chat.latestMessage.content.substring(0, chat.isGroupChat ? 21 - chat.latestMessage.sender.name.length : 21)}
                                                            <span className='hidden xl:inline'>
                                                                {chat.latestMessage.content.substring(chat.isGroupChat ? 21 - chat.latestMessage.sender.name.length : 21, chat.isGroupChat ? 35 - chat.latestMessage.sender.name.length : 35)}
                                                            </span>
                                                            ...
                                                        </>
                                                        : chat.latestMessage.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 ml-auto'>
                                        {chat.latestMessage?.createdAt && (
                                            <span className='text-gray-500 text-xs'>
                                                {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                        {(chat.hasUnreadMessages && notifications.length > 0) && (
                                            <span className='flex justify-center items-center text-sm w-5 h-5 rounded-full bg-blue-600 text-white'>{notifications.length}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div >
    );
}

export default Contacts