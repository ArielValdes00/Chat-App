import React from 'react';
import { getChats } from '@/utils/apiChats';

const Chat = ({ chats }) => {

  return (
    <div>
        {chats.map((chat) => (
            <div key={chat._id}>
                <p>{chat.chatName}</p>
            </div>
        ))}
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
