import React, { useState, useEffect } from 'react';
import { getSender } from "../config/config.js";
import { ChatState } from '@/context/ChatProvider';
import { BsEmojiSmileFill } from "react-icons/bs";
import NoChats from '../../public/icons/no-chats.svg';
import { IoSend } from "react-icons/io5";
import Image from 'next/image.js';
import Modal from './Modal.js';
import UpdateGroupChatModal from './UpdateGroupChatModal.js';
import ScrollableChat from './ScrollableChat.js';
import { LuLoader2 } from "react-icons/lu";
import { io } from "socket.io-client";
import { deleteAllMessages, getChats, getMessages, readMessages, sendMessage } from '@/utils/apiChats';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import useBooleanState from '@/hooks/useBooleanState.js';
import HeaderChat from './HeaderChat.js';

const SingleChat = ({ functionShowContact, toast, user }) => {
    const { selectedChat, setNotifications, setChats, notifications } = ChatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [showModalInfo, toggleShowModalInfo] = useBooleanState(false);
    const [showGroupChatModal, toggleShowGroupChatModal] = useBooleanState(false);
    const [socket, setSocket] = useState(null);
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [loader, setLoader] = useState(false);

    const toggleShowEmojis = () => {
        setShowEmojiPanel(!showEmojiPanel);
    };

    const onEmojiClick = (emojiObject) => {
        setNewMessage(prevMessage => prevMessage + emojiObject.native);
    };

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


    return (

        <div className='flex flex-col h-full'>
            {showModalInfo && (
                <Modal
                    user={user}
                    handleCloseModal={() => toggleShowModalInfo()}
                    userInfo={getSender(user, selectedChat.users)}
                />
            )}
            {showGroupChatModal && (
                <UpdateGroupChatModal
                    handleCloseModal={() => toggleShowGroupChatModal()}
                    fetchMessages={fetchMessages}
                    toast={toast}
                    user={user}
                />
            )}
            {selectedChat ? (
                <>
                    <HeaderChat
                        user={user}
                        setMessages={setMessages}
                        fetchMessages={fetchMessages}
                        setShowEmojiPanel={setShowEmojiPanel}
                        toggleShowGroupChatModal={toggleShowGroupChatModal}
                        toggleShowModalInfo={toggleShowModalInfo}
                        functionShowContact={functionShowContact}
                    />
                    <div className='flex flex-grow bg-gray-100 flex-col h-[412px] border-t overflow-y-auto'>
                        {loader ? (
                            <div className='flex h-full items-center justify-center'>
                                <LuLoader2 size={30} className='text-blue-600 animate-spin' />
                            </div>
                        ) : (
                            <ScrollableChat messages={messages} user={user} />
                        )}
                    </div>
                    <div>
                        {istyping && (
                            <p className='text-sm font-base lowercase'>typing...</p>
                        )}
                    </div>
                    <form onSubmit={sendMessages} className="flex items-center bg-white gap-3 px-4 py-[14px] 2xl:py-7 text-sm relative z-40">
                        <span
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    toggleShowEmojis();
                                }
                            }}
                            onClick={toggleShowEmojis}
                            className='emoji-container cursor-pointer'
                        >
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