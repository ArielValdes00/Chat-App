import React, { useEffect, useState } from 'react';
import { BsInfoCircleFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { AnimatePresence, motion } from 'framer-motion';
import { variants } from '@/utils/animations.js';
import { getSender } from '@/config/config';
import { ChatState } from '@/context/ChatProvider';
import { deleteAllMessages, deleteCurrentChat, getMessages } from '@/utils/apiChats';

const HeaderChat = ({
    functionShowContact,
    user,
    setShowEmojiPanel,
    toggleShowModalInfo,
    toggleShowGroupChatModal,
    setMessages,
    fetchMessages }) => {
    const { selectedChat, setSelectedChat } = ChatState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openMenuOptions = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleOutsideClick = (e) => {
        if (e.target.closest(".img-container") === null && e.target.closest(".menu") === null &&
            e.target.closest(".emoji-container") === null) {
            setIsMenuOpen(false);
            setShowEmojiPanel(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const deleteChat = async () => {
        try {
            await deleteMessages();
            await deleteCurrentChat(selectedChat._id, user);
            setSelectedChat(null);
            functionShowContact();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteMessages = async () => {
        try {
            await deleteAllMessages(selectedChat._id, user);
            const updatedMessages = await getMessages(selectedChat._id, user);
            setMessages((prevMessages) =>
                prevMessages.map((message) => {
                    const updatedMessage = updatedMessages.find((m) => m._id === message._id);
                    if (updatedMessage && updatedMessage.deletedBy.includes(user._id)) {
                        return { ...message, isDeleted: true };
                    }
                    return message;
                })
            );
            setIsMenuOpen(false);
            fetchMessages();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex justify-between items-center py-[6px] px-3 capitalize font-bold text-lg">
            <div className="flex items-center lg:gap-3 2xl:py-3">
                <FaArrowLeft
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            functionShowContact();
                        }
                    }}
                    size={25}
                    className='me-3 lg:hidden cursor-pointer'
                    onClick={functionShowContact}
                />
                {!selectedChat.isGroupChat ? (
                    <div className='flex items-center 2xl:text-2xl gap-3 py-2' onClick={() => toggleShowModalInfo()}>
                        <img
                            src={getSender(user, selectedChat.users).picture}
                            height={36}
                            width={36}
                            alt={getSender(user, selectedChat.users).name}
                            className="rounded-full bg-cover profile-img"
                        />
                        {getSender(user, selectedChat.users).name}
                    </div>
                ) : (
                    <div className='flex items-center gap-3 px-1 py-2 lg:py-0' onClick={() => toggleShowGroupChatModal()}>
                        <img
                            src={selectedChat.picture}
                            alt={selectedChat.name}
                            className='rounded-full profile-img'
                        />
                        <div>
                            <p className='md:mb-[-9px] md:mt-[5px] md:text-lg'>{selectedChat.chatName}</p>
                            <div className='flex gap-1 flex-wrap'>
                                {[
                                    ...selectedChat.users.filter(u => user.name !== u.name),
                                    selectedChat.users.find(u => user.name === u.name)
                                ]?.map((u, index, arr) => (
                                    <div key={u._id} className='text-[11px] font-normal lowercase capitalize'>
                                        <p className='leading-[1] sm:leading-7'>
                                            {u?.name === user.name ? "You" : u?.name}
                                            {index !== arr.length - 1 ? "," : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className='flex items-center gap-1 lg:gap-2'>
                {!selectedChat.isGroupChat ? (
                    <BsInfoCircleFill
                        size={28}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                toggleShowModalInfo();
                            }
                        }}
                        className='text-blue-600 cursor-pointer'
                        onClick={() => toggleShowModalInfo()}
                    />
                ) : (
                    <BsInfoCircleFill
                        size={28}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                toggleShowGroupChatModal();
                            }
                        }}
                        className='text-blue-600 cursor-pointer'
                        onClick={() => toggleShowGroupChatModal()}
                    />
                )}
                <div className='relative img-container'>
                    <BsThreeDotsVertical
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                openMenuOptions();
                            }
                        }}
                        size={28}
                        className='text-blue-600 cursor-pointer'
                        onClick={openMenuOptions}
                    />
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={variants}
                                transition={{ duration: 0.15 }}
                                className='absolute right-2 top-0'>
                                <div className='menu absolute right-0 top-9 w-[150px] shadow-md text-sm 2xl:text-lg font-semibold lowercase capitalize bg-white rounded-md border z-40'>
                                    <div
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                deleteMessages();
                                            }
                                        }}
                                        onClick={deleteMessages}
                                        className='flex items-center justify-between hover:bg-gray-100 p-2 px-4 2xl:py-3 2xl:px-6 cursor-pointer'
                                    >
                                        <p>Clear Chat</p>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                deleteChat();
                                            }
                                        }}
                                        onClick={deleteChat}
                                        className='flex items-center justify-between hover:bg-gray-100 p-2 px-4 2xl:py-3 2xl:px-6 cursor-pointer'
                                    >
                                        <p>Delete Chat</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default HeaderChat