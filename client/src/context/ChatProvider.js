import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);

        if (!userInfo) {
            router.push("/")
        }
    }, [])

    return <ChatContext.Provider value={{
        user, setUser,
        chats, setChats,
        selectedChat, setSelectedChat
    }}>{children}</ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;