import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showContacts, setShowContacts] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
        }
    }, [router]);

    const handleShowContacts = () => {
        setShowContacts(true);
    }

    const handleShowChatBox = () => {
        setShowContacts(false);
    }

    const handleShowSideBar = () => {
        setShowSideBar(!showSideBar);
    }
    console.log(showContacts)

    return <ChatContext.Provider value={{
        user, setUser,
        chats, setChats,
        selectedChat, setSelectedChat,
        notifications, setNotifications,
        handleShowContacts, handleShowChatBox,
        showContacts, setShowContacts,
        loader, setLoader,
        handleShowSideBar,
        showSideBar
    }}>{children}</ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;