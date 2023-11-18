import { createContext, useState, useContext } from "react";
import useBooleanState from "@/hooks/useBooleanState";

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showContacts, toggleShowContacts] = useBooleanState(false);
    const [showSideBar, toggleShowSideBar] = useBooleanState(false);

    return <ChatContext.Provider value={{
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