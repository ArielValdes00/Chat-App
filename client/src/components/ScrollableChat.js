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
      return "text-black";
    }
    return userColors[userId] || "text-gray-200";
  };

    return (
        <div className="flex flex-col gap-4 h-full mt-[2px] h-[463px] overflow-y-auto border-t pt-3 px-5">
            {messages.map((message) => (
                <div
                    key={message._id}
                    className={`flex justify-${message.sender._id === user._id ? "end ml-auto" : "start"}`}
                >
                    <div className={`p-2 px-5 rounded-full max-w-xs flex items-end gap-2 ${message.sender._id === user._id ? "bg-gray-200" : "bg-green-400"}`}>
                        <div className='flex flex-col'>
                            {isGroupChat && (
                                <p className={`text-sm font-base lowercase capitalize ${getUserColor(message.sender._id)}`}>{message.sender.name}</p>
                            )}
                            <p className="text-md font-base lowercase">{message.content}</p>
                        </div>
                        <p className="text-[10px]">{formatTime(message.createdAt)}</p>
                    </div>
                </div>
            ))}
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
