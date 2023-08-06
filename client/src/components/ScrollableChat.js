import { ChatState } from '@/context/ChatProvider';
import Image from 'next/image';
import React from 'react';
import { useRef, useEffect } from 'react';
import TickDark from '../../public/icons/tick-dark.png';
import TickBlue from '../../public/icons/tick-blue.png';
import { getSender } from '@/config/config';


const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const isGroupChat = messages.length > 0 && messages[0].chat.isGroupChat;

    const userColors = {};
    const users = messages.map((message) => message.sender._id);
    const uniqueUsers = [...new Set(users)];
    uniqueUsers.forEach((userId, index) => {
        userColors[userId] = `text-color-${index + 1}`;
    });

    const getUserColor = (userId) => {
        if (userId === user._id) {
            return "text-black";
        }
        return userColors[userId] || "text-gray-200";
    };

    return (
        <div className="flex flex-col gap-4 pt-3 px-3">
            {messages.map((message) => {
                if (!message.deletedBy.includes(user._id)) {
                    return (
                        <div
                            key={message._id}
                            className={`flex justify-${message.sender._id === user._id ? "end ml-auto" : "start"}`}
                        >
                            {isGroupChat && message.sender._id !== user._id && (
                                <img
                                    src={message.sender.picture}
                                    alt={message.sender.name}
                                    className='profile-img rounded-full me-2'
                                />
                            )}
                            <div className={`p-2 pb-[6px] px-3 rounded-md lowercase max-w-sm lg:max-w-xl font-[500] flex items-end gap-3 ${message.sender._id === user._id ? "bg-blue-600 text-gray-100" : "bg-white"}`}>
                                <div className='flex flex-col leading-6'>
                                    {isGroupChat && (
                                        <p className={`text-[15px] capitalize ${getUserColor(message.sender._id)}`}>{message.sender.name}</p>
                                    )}
                                    <p className="text-[15px] leading-[20px]">{message.content}</p>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    <p className="text-[10px]">{formatTime(message.createdAt)}</p>
                                    {message.sender._id === user._id && (
                                        <div>
                                            {
                                                message.readBy.includes(getSender(user, message.chat.users)) ? (
                                                    <Image src={TickBlue} height={23} width={23} loading="eager" alt='Viewed' />
                                                ) : (
                                                    <Image src={TickDark} height={23} width={23} loading="eager" alt='Sended' />
                                                )
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export default ScrollableChat;
