import React, { useState, useEffect } from 'react';
import { getSender } from "../config/config.js";
import { ChatState } from '@/context/ChatProvider';
import { BsInfoCircleFill, BsThreeDotsVertical } from "react-icons/bs";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import NoChats from '../../public/icons/no-chats.svg';
import { IoSend } from "react-icons/io5";
import Image from 'next/image.js';
import Modal from './Modal.js';
import UpdateGroupChatModal from './UpdateGroupChatModal.js';
import ScrollableChat from './ScrollableChat.js';
import { AnimatePresence, motion } from 'framer-motion';
import { LuLoader2 } from "react-icons/lu";
import { io } from "socket.io-client";
import { deleteAllMessages, deleteCurrentChat, getChats, getMessages, readMessages, sendMessage } from '@/utils/apiChats';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import useBooleanState from '@/hooks/useBooleanState.js';
import { variants } from '@/utils/animations.js';

const SingleChat = ({ functionShowContact, toast }) => {
    const { user, selectedChat, setNotifications, setSelectedChat, setChats, notifications } = ChatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [showModalInfo, toggleShowModalInfo] = useBooleanState(false);
    const [showGroupChatModal, toggleShowGroupChatModal] = useBooleanState(false);
    const [socket, setSocket] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [loader, setLoader] = useState(false);

    const toggleShowEmojis = () => {
        setShowEmojiPanel(!showEmojiPanel);
    };

    const onEmojiClick = (emojiObject) => {
        setNewMessage(prevMessage => prevMessage + emojiObject.native);
    };

    const openMenuOptions = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_URL);

        if (user) {
            newSocket.emit("setup", user);
        }

        newSocket.on("connected", () => setSocketConnected(true));
        newSocket.on("typing", () => setIsTyping(true));
        newSocket.on("stop typing", () => setIsTyping(false));
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user, selectedChat, notifications]);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoader(true);
            const messagesData = await getMessages(selectedChat._id, user);
            setLoader(false);
            const filteredMessages = messagesData.filter((message) => !message.isDeleted);
            setMessages(filteredMessages);
            socket?.emit("join chat", selectedChat._id)
            socket?.emit('message read', { chatId: selectedChat._id, userId: user._id });
            await readMessages(selectedChat, user)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("message recieved", (newMessageRecieved) => {
                if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
                    setNotifications((prevNotifications) => [newMessageRecieved, ...prevNotifications]);
                } else {
                    setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
                    readMessages(selectedChat, user);
                    socket.emit('message read', { chatId: selectedChat._id, userId: user._id });
                    if (user && user.token) {
                        const fetchChats = async () => {
                            const chatsData = await getChats(user);
                            const filteredChats = chatsData.filter((chat) => !chat.latestMessage || !chat.latestMessage.deletedBy.includes(user._id));

                            setChats(filteredChats)
                        };
                        fetchChats();
                    }
                }
            });
        }
        fetchMessages();
    }, [socket, selectedChat, notifications]);

    const sendMessages = async (e) => {
        e.preventDefault()
        socket.emit("stop typing", selectedChat._id);
        if (newMessage === "") {
            console.log("empty message")
        } else {
            try {
                setNewMessage("");
                const data = await sendMessage(newMessage, selectedChat._id, user);
                socket.emit("new message", data);
                setMessages([...messages, data]);
                fetchMessages();
            } catch (error) {
                console.log(error)
            }
        }
    };
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
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

    return (

        <div className='flex flex-col h-full'>
            {showModalInfo && (
                <Modal
                    handleCloseModal={() => toggleShowModalInfo()}
                    userInfo={getSender(user, selectedChat.users)}
                />
            )}
            {showGroupChatModal && (
                <UpdateGroupChatModal
                    handleCloseModal={() => toggleShowGroupChatModal()}
                    fetchMessages={fetchMessages}
                    toast={toast}
                />
            )}
            {selectedChat ? (
                <>
                    <div className="flex justify-between items-center py-[6px] px-3 capitalize font-bold text-lg">
                        <div className="flex items-center lg:gap-3 2xl:py-3">
                            <FaArrowLeft
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
                                    className='text-blue-600 cursor-pointer'
                                    onClick={() => toggleShowModalInfo()}
                                />
                            ) : (
                                <BsInfoCircleFill
                                    size={28}
                                    className='text-blue-600 cursor-pointer'
                                    onClick={() => toggleShowGroupChatModal()}
                                />
                            )}
                            <div className='relative img-container'>
                                <BsThreeDotsVertical
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
                                                <div onClick={deleteMessages} className='flex items-center justify-between hover:bg-gray-100 p-2 px-4 2xl:py-3 2xl:px-6 cursor-pointer'>
                                                    <p>Clear Chat</p>
                                                </div>
                                                <div onClick={deleteChat} className='flex items-center justify-between hover:bg-gray-100 p-2 px-4 2xl:py-3 2xl:px-6 cursor-pointer'>
                                                    <p>Delete Chat</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-grow bg-gray-100 flex-col h-[412px] border-t overflow-y-auto'>
                        {loader ? (
                            <div className='flex h-full items-center justify-center'>
                                <LuLoader2 size={30} className='text-blue-600 animate-spin' />
                            </div>
                        ) : (
                            <ScrollableChat messages={messages} />
                        )}
                    </div>
                    <div>
                        {istyping && (
                            <p className='text-sm font-base lowercase'>typing...</p>
                        )}
                    </div>
                    <form onSubmit={sendMessages} className="flex items-center bg-white gap-3 px-4 py-[14px] 2xl:py-7 text-sm relative z-40">
                        <span onClick={toggleShowEmojis} className='emoji-container cursor-pointer'>
                            <BsEmojiSmileFill size={27} className='text-blue-600' />
                        </span>
                        <input
                            type="text"
                            placeholder="Message..."
                            className="w-full bg-gray-100 p-2 outline-none rounded-full ps-4 2xl:py-4"
                            value={newMessage}
                            onChange={typingHandler}
                            name='sendMessage'
                        />
                        <button type="submit">
                            <IoSend size={30} className='text-blue-600' />
                        </button>
                    </form>
                    {showEmojiPanel &&
                        <div className='absolute bottom-0 emoji-container'>
                            <Picker data={data}
                                onEmojiSelect={onEmojiClick}
                                previewPosition="none"
                                perLine={10}
                                emojiSize={20}
                                emojiButtonSize={30}
                                skinTonePosition="none"
                                theme="light"
                            />
                        </div>
                    }
                </>
            ) : (
                <div className='h-full bg-gray-100 flex flex-col items-center justify-center gap-5 font-semibold'>
                    <Image src={NoChats} priority={true} height={250} width={350} alt='Chatify' />
                    <p>Click on a user to start chatting</p>
                </div>
            )
            }
        </div >
    );
}

export default SingleChat;