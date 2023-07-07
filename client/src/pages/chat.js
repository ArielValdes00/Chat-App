import React, { useState } from 'react';
import { ChatState } from '@/context/ChatProvider';
import Navbar from '@/components/Navbar';
import Contacts from '@/components/Contacts';
import ChatBox from '@/components/ChatBox';

const Chat = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();
    return (
        <div className='h-screen'>
            <Navbar />
            <div className='grid grid-cols-5'>
                <Contacts fetchAgain={fetchAgain} />
                <div className='col-span-4 border-l'>
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </div>
            </div>
        </div>
    );
};

export default Chat;
