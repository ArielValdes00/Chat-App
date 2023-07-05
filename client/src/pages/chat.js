import React from 'react';
import { getChats } from '@/utils/apiChats';
import { ChatState } from '@/context/ChatProvider';
import Navbar from '@/components/Navbar';

const Chat = ({ chats }) => {
    const { user } = ChatState();
  return (
    <div>
        <Navbar/>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const chats = await getChats();
    return {
      props: {
        chats
      }
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        chats: []
      }
    };
  }
}

export default Chat;
