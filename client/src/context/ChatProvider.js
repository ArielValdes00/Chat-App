import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notificatons, setNotifications] = useState([]);
    const [showContacts, setShowContacts] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
        }
    }, [router]);

    const handleShowContacts = () => {
        setShowContacts(!showContacts);
    }


    return <ChatContext.Provider value={{
        user, setUser,
        chats, setChats,
        selectedChat, setSelectedChat,
        notificatons, setNotifications,
        handleShowContacts,
        showContacts, setShowContacts
    }}>{children}</ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;