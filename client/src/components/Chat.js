import { ChatState } from '@/context/ChatProvider';
import React from 'react'

const Chat = () => {

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  return (
    <div>Chat</div>
  )
}

export default Chat