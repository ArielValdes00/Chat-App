import { ChatState } from '@/context/ChatProvider';
import React from 'react'
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <div className=''>
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </div>
    )
}

export default ChatBox