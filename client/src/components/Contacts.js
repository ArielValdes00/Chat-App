import React, { useState, useEffect } from 'react'
import { ChatState } from '@/context/ChatProvider';
import { getSender } from '@/config/config.js';
import axios from 'axios';
import AddGroup from '../../public/icons/add-group.png';
import Image from 'next/image';
import GroupChatModel from './GroupChatModel';

const Contacts = ({ fetchAgain, setFetchAgain }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const [showModal, setShowModal] = useState(false);

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
        fetchChats();
    }, [fetchAgain]);

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleOpenModal = () => {
        setShowModal(true)
    }

    
    return (
        <div>
            {showModal && <GroupChatModel handleCloseModal={handleCloseModal}/>}
            <p className='p-3 border-b text-center font-extrabold text-xl'>My Chats</p>
            <div onClick={handleOpenModal} className='border-b p-3 flex items-center justify-center gap-3 hover:bg-gray-100 cursor-pointer'>
                <Image src={AddGroup} height={30} width={30} alt='Add Group'/>
                <p className='font-bold'>New Group Chat</p>
            </div>
            {chats.map((chat) => (
                <div key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className='flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100'
                >
                    <img src={getSender(loggedUser, chat.users).picture}
                        height={30}
                        width={30}
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