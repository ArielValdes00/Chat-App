import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import useBooleanState from "@/hooks/useBooleanState";

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showContacts, toggleShowContacts] = useBooleanState(false);
    const [showSideBar, toggleShowSideBar] = useBooleanState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
        }
    }, [router]);

    return <ChatContext.Provider value={{
        user, setUser,
        chats, setChats,
        selectedChat, setSelectedChat,
        notifications, setNotifications,
        showContacts, toggleShowContacts,
        toggleShowSideBar, showSideBar
    }}>{children}</ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;