import React, { useState, useEffect } from 'react';
import { getSender } from "../config/config.js";
import { ChatState } from '@/context/ChatProvider';
import Info from '../../public/icons/info.png';
import Menu from '../../public/icons/menu.png';
import Clear from '../../public/icons/clean.png';
import Delete from '../../public/icons/delete.png';
import LeftArrow from '../../public/icons/left-arrow.png';
import NoChats from '../../public/icons/no-chats.svg';
import sendMessageIcon from '../../public/icons/send-message.png';
import Image from 'next/image.js';
import Modal from './Modal.js';
import UpdateGroupChatModal from './UpdateGroupChatModal.js';
import axios from 'axios';
import ScrollableChat from './ScrollableChat.js';
import { io } from "socket.io-client";
import { FaRegSmile } from 'react-icons/fa';
import EmojiPanel from './EmojiPanel.js';
import { getChats } from '@/utils/apiChats';

const SingleChat = ({ functionShowContact }) => {
    const { user, selectedChat, setNotifications, setSelectedChat, setChats } = ChatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [showGroupChatModal, setShowGroupChatModal] = useState(false);
    const [socket, setSocket] = useState(null);
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleEmojiPanel = () => {
        setShowEmojiPanel(prevState => !prevState);
    }
    const selectEmoji = (emoji) => {
        setShowEmojiPanel(false);
        setNewMessage(prevMessage => prevMessage + emoji);
    }

    const handleCloseModalInfo = () => {
        setShowModalInfo(false)
    }

    const handleOpenModalInfo = () => {
        setShowModalInfo(true)
    }
    const handleCloseModalGroup = () => {
        setShowGroupChatModal(false)
    }

    const handleOpenModalGroup = () => {
        setShowGroupChatModal(true)
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
    }, [user, selectedChat]);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const res = await axios.get(`${process.env.NEXT_PUBLIC_MESSAGE_URL}/${selectedChat._id}`,
                config
            );
            const messagesData = res.data;

            const filteredMessages = messagesData.filter((message) => !message.isDeleted);

            setMessages(filteredMessages);
            socket.emit("join chat", selectedChat._id)
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
    }, [socket, selectedChat]);

    const sendMessage = async (e) => {
        e.preventDefault()
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setNewMessage("");
            const { data } = await axios.post(process.env.NEXT_PUBLIC_MESSAGE_URL,
                {
                    content: newMessage,
                    chatId: selectedChat._id,
                },
                config
            );
            socket.emit("new message", data);
            setMessages([...messages, data]);
            fetchMessages();
        } catch (error) {
            console.log(error)
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

    const deleteAllMessages = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
    
            await axios.put(`${process.env.NEXT_PUBLIC_MESSAGE_URL}/${selectedChat._id}`, null, config);
    
            const res = await axios.get(`${process.env.NEXT_PUBLIC_MESSAGE_URL}/${selectedChat._id}`, config);
            const updatedMessages = res.data;
    
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


    const handleOutsideClick = (e) => {
        if (e.target.closest(".img-container") === null && e.target.closest(".menu") === null) {
            setIsMenuOpen(false);
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
            await deleteAllMessages();
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const res = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/${selectedChat._id}`, null, config);
            console.log(res);
            setSelectedChat(null);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-col max-h-[100%]'>
            {showModalInfo && (
                <Modal
                    handleCloseModal={handleCloseModalInfo}
                    userInfo={getSender(user, selectedChat.users)}
                />
            )}
            {showGroupChatModal && (
                <UpdateGroupChatModal
                    handleCloseModal={handleCloseModalGroup}
                    fetchMessages={fetchMessages}
                />
            )}
            {selectedChat ? (
                <div className="uppercase font-bold text-lg ">
                    <div className="flex justify-between items-center py-1 px-3">
                        <div className="flex items-center gap-3">
                            <Image src={LeftArrow}
                                height={25}
                                width={25}
                                alt='Contact'
                                className='me-1 lg:hidden cursor-pointer'
                                onClick={functionShowContact}
                            />
                            {!selectedChat.isGroupChat ? (
                                <div className='flex items-center gap-3 py-2'>
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
                                <div className='flex items-center gap-3'>
                                    <img
                                        src={selectedChat.picture}
                                        alt={selectedChat.name}
                                        className='rounded-full profile-img'
                                    />
                                    <div>
                                        <p className='mb-[-9px] mt-[5px]'>{selectedChat.chatName}</p>
                                        <div className='flex gap-1'>
                                            {[
                                                ...selectedChat.users.filter(u => user.name !== u.name),
                                                selectedChat.users.find(u => user.name === u.name)
                                            ]?.map((u, index, arr) => (
                                                <div key={u._id} className='text-[11px] font-normal lowercase capitalize'>
                                                    <p>
                                                        {u.name === user.name ? "You" : u.name}
                                                        {index !== arr.length - 1 ? "," : ""}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='flex'>
                            {!selectedChat.isGroupChat ? (
                                <Image
                                    src={Info}
                                    height={30}
                                    width={30}
                                    alt="Info"
                                    onClick={handleOpenModalInfo}
                                    className="cursor-pointer me-2"
                                />
                            ) : (

                                <Image
                                    src={Info}
                                    height={30}
                                    width={30}
                                    alt="Info"
                                    onClick={handleOpenModalGroup}
                                    className="cursor-pointer me-2"
                                />
                            )}
                            <div className='relative .img-container'>
                                <Image
                                    src={Menu}
                                    height={30}
                                    width={30}
                                    alt="Menu"
                                    onClick={() => setIsMenuOpen(true)}
                                    className="cursor-pointer"
                                />
                                {isMenuOpen && (
                                    <div className='menu absolute right-0 top-9 w-[150px] shadow-md text-sm font-semibold lowercase capitalize bg-white rounded-md border'>
                                        <div onClick={deleteAllMessages} className='flex items-center justify-between hover:bg-gray-100 p-2 px-4 cursor-pointer'>
                                            <p>Clear Chat</p>
                                            <Image src={Clear} height={18} width={18} alt='Clear' />
                                        </div>
                                        <div onClick={deleteChat} className='flex items-center justify-between hover:bg-gray-100 p-2 px-4 cursor-pointer'>
                                            <p>Delete Chat</p>
                                            <Image src={Delete} height={18} width={18} alt='Delete' />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-[69vh] border-t overflow-y-auto">
                            <ScrollableChat messages={messages} />
                        </div>
                        <div>
                            {istyping ? (
                                <p className='text-sm font-base lowercase'>{`${getSender(user, selectedChat.users).name} is typing...`}</p>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <form onSubmit={sendMessage} className="flex bg-gray-200 p-4 text-sm relative">
                        <button type="button" onClick={toggleEmojiPanel} className="px-3">
                            <FaRegSmile size={30} className='bg-yellow-300 rounded-full border-none' />
                        </button>
                        {showEmojiPanel && <EmojiPanel onSelect={selectEmoji} />}
                        <input
                            type="text"
                            placeholder="Message..."
                            className="w-full p-2 py-3 outline-none rounded-lg ps-4"
                            value={newMessage}
                            onChange={typingHandler}
                        />
                        <button type="submit" className="px-3">
                            <Image src={sendMessageIcon} height={30} width={30} alt='Send Message' />
                        </button>
                    </form>
                </div>
            ) : (
                <div className='h-[90vh] flex flex-col items-center justify-center gap-5 font-semibold'>
                    <Image src={NoChats} priority={true} height={250} width={350} alt='Chatify' />
                    <p className=''>Click on a user to start chatting</p>
                </div>
            )}
        </div>
    );

}

export default SingleChat