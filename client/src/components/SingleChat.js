import React, { useState } from 'react';
import { getSender } from "../config/config.js";
import { ChatState } from '@/context/ChatProvider';
import Info from '../../public/icons/info.png';
import Image from 'next/image.js';
import Modal from './Modal.js';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, setSelectedChat, selectedChat } = ChatState();
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleOpenModal = () => {
        setShowModal(true)
    }

    return (
        <div>
            {showModal && <Modal handleCloseModal={handleCloseModal} user={getSender(user, selectedChat.users)} />}
            {
                selectedChat ? (
                    <p className='uppercase p-2 px-5 font-bold text-lg'>
                        {!selectedChat.isGroupChat ? (
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-3'>
                                    <img
                                        src={getSender(user, selectedChat.users).picture}
                                        height={30}
                                        width={30}
                                        alt={getSender(user, selectedChat.users).name}
                                        className='rounded-full'
                                    />
                                    {getSender(user, selectedChat.users).name}
                                </div>
                                <Image
                                    src={Info}
                                    height={30}
                                    width={30}
                                    alt='Info'
                                    onClick={handleOpenModal}
                                    className='cursor-pointer'
                                />
                            </div>
                        ) : (
                            <>
                                {selectedChat.chatName}
                            </>
                        )}
                    </p>
                ) : (
                    <p>Click on a user to Start Chatting</p>
                )
            }
        </div>
    )
}

export default SingleChat