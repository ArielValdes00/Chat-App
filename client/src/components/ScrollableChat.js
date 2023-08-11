import { ChatState } from '@/context/ChatProvider';
import React from 'react';
import { useRef, useEffect } from 'react';

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
            return "text-gray-100";
        }
        return userColors[userId] || "text-gray-200";
    };

    const groupMessagesByDate = messages.reduce((result, message) => {
        if (!message.deletedBy.includes(user._id)) {
            const date = new Date(message.createdAt).toLocaleDateString();
            if (!result[date]) {
                result[date] = [];
            }
            result[date].push(message);
        }
        return result;
    }, {});

    return (
        <div className="flex flex-col gap-4 pt-3 px-3">
            {Object.keys(groupMessagesByDate).map((date) => {
                const messageDate = new Date(date);
                const today = new Date();
                const oneWeekAgo = new Date(today - 7 * 86400000);
                return (
                    <div key={date} className="text-center text-gray-500 text-sm">
                        {date === today.toLocaleDateString()
                            ? 'Today'
                            : date === new Date(today - 86400000).toLocaleDateString()
                                ? 'Yesterday'
                                : messageDate > oneWeekAgo
                                    ? messageDate.toLocaleDateString('en-US', { weekday: 'long' })
                                    : date
                                }
                    </div>
                );
            })}
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
                            <div className={`p-2 pb-[6px] px-3 lowercase max-w-sm lg:max-w-xl font-[500] flex items-end gap-3 ${message.sender._id === user._id ? "bg-blue-600 text-gray-100 rounded-md arrow-right" : "bg-white arrow-left"}`}>
                                <div className='flex flex-col leading-6'>
                                    {isGroupChat && (
                                        <p className={`text-[15px] capitalize ${getUserColor(message.sender._id)}`}>{message.sender.name}</p>
                                    )}
                                    <p className="text-[15px] leading-[20px]">{message.content}</p>
                                </div>
                                <div className='flex items-end justify-center gap-2 text-[10px]'>
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

export default ScrollableChat;
