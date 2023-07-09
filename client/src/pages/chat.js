import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Contacts from '@/components/Contacts';
import ChatBox from '@/components/ChatBox';
import { ChatState } from '@/context/ChatProvider';

const Chat = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { showContacts } = ChatState();
  
    return (
      <div className='max-h-screen flex flex-col'>
        <Navbar />
        <div className='grid grid-cols-5'>
          <div className={`${!showContacts ? "block" : "hidden lg:block"} col-span-5 lg:col-span-1`}>
            <Contacts fetchAgain={fetchAgain} />
          </div>
          <div className={`${showContacts ? "block" : "hidden lg:block"} col-span-5 lg:col-span-4 border-l`}>
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        </div>
      </div>
    );
  };
  
  export default Chat;
  
