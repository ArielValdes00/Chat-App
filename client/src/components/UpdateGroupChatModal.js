import React, { useState } from 'react';
import { ChatState } from '@/context/ChatProvider';
import { IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { LuLoader2 } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { addUserToGroup, getChatsFromServer, removeUserFromChat, renameGroupChat, searchUsers, updateGroupPicture } from '@/utils/apiChats';
import 'animate.css';

const UpdateGroupChatModal = ({ fetchMessages, handleCloseModal, toast }) => {
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loader, setLoader] = useState(false);
    const { selectedChat, setSelectedChat, user, setChats, handleShowContacts } = ChatState();

    const handleUploadInput = async (e) => {
        const imageFile = e.target.files[0];
        const response = await updateGroupPicture(imageFile, user, selectedChat._id);
        setSelectedChat(prevChat => ({ ...prevChat, picture: response.data.picture }));

        if (response) {
            const chatInfo = await getChatsFromServer(user);

            setChats(chatInfo);

        } else {
            toast.error('An error occurred while updating the profile picture');
        }
    };

    const handleRename = async (e) => {
        e.preventDefault();
        if (!groupChatName) return;

        try {
            const data = await renameGroupChat(selectedChat._id, groupChatName, user);
            setSelectedChat(data);
            setGroupChatName("");
        } catch (error) {
            console.log(error)
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoader(true);
            const data = await searchUsers(search, user);
            setSearchResult(data);
            setLoader(false);
        } catch (error) {
            console.log(error)
        }
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast.error("only admins can remove users")
            return;
        }

        try {
            const data = await removeUserFromChat(selectedChat._id, user1._id, user);

            if (user1._id === user._id) {
                handleCloseModal();
                setSelectedChat();
                handleShowContacts()
            } else {
                setSelectedChat(data);
            }
            fetchMessages();
        } catch (error) {
            console.log(error)
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast.error("User already in group")
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("Only admins can add someone")
            return;
        }

        try {
            const data = await addUserToGroup(selectedChat._id, user1._id, user);
            setSelectedChat(data);
        } catch (error) {
            console.log(error)
        }
        setGroupChatName("");
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='absolute flex flex-col items-center gap-3 bg-white p-4 rounded-xl shadow-lg z-10 relative w-5/6 sm:w-1/2 xl:w-[40%] animate__animated animate__fadeIn'>
                <div className='mb-2'>
                    <IoClose
                        size={30}
                        onClick={handleCloseModal}
                        className='cursor-pointer absolute right-3 top-3'
                    />
                </div>
                <div className='flex items-center relative'>
                    <img
                        src={selectedChat.picture}
                        alt={selectedChat.chatName}
                        className='rounded-full profile-img-modal'
                    />
                    <input
                        type="file"
                        onChange={handleUploadInput}
                        accept="image/*"
                        id="upload-button"
                        className="hidden"
                    />
                    <label
                        htmlFor="upload-button"
                    >
                        <FiEdit
                            size={20}
                            className='absolute ms-2 cursor-pointer'
                        />
                    </label>
                </div>
                <p className='text-center text-2xl font-bold capitalize'>{selectedChat.chatName}</p>
                <div className='flex flex-wrap justify-center items-center gap-2 mt-1'>
                    {selectedChat.users.map((user) => (
                        <div
                            key={user._id}
                            className={`${selectedChat.groupAdmin._id === user._id && 'bg-indigo-600 text-white'} flex flex-wrap items-center justify-center bg-gray-200 rounded-full border py-1 px-3 cursor-pointer`}>
                            <div className='flex flex-nowrap items-center gap-1'>
                                <p className='capitalize truncate'>{user.name}</p>
                                <IoClose
                                    size={16}
                                    onClick={() => handleRemove(user)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2 mt-1 w-2/3">
                    <label htmlFor="chat-name" className="text-center font-semibold">
                        Rename Group
                    </label>
                    <div className="flex relative">
                        <input
                            onChange={(e) => setGroupChatName(e.target.value)}
                            type="text"
                            placeholder="Your New Chat Name"
                            className="border w-full rounded-lg p-2 ps-3 focus:outline-none focus:ring focus:border-blue-600"
                        />
                        <button
                            onClick={handleRename}
                            type="button"
                        >
                            <FaCheckCircle
                                size={25}
                                className='absolute top-2 right-[-33px] text-blue-600'
                            />
                        </button>
                    </div>
                    <label htmlFor="users" className="text-center font-semibold">
                        Add Users
                    </label>
                    <input
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text"
                        placeholder="Add New Users"
                        className="border rounded-lg p-2 ps-3 focus:outline-none focus:ring focus:border-blue-600"
                        value={search}
                    />
                </div>
                <div className={`${search && "h-[104px]"} overflow-y-auto`}>
                    {loader
                        ? <LuLoader2 className='mx-auto animation-spin' />
                        : searchResult.slice(0, 3).map((user) => (
                            <div
                                key={user._id}
                                user={user}
                                onClick={() => handleAddUser(user)}
                                className='flex items-center gap-3 py-1 hover:bg-gray-100 cursor-pointer'
                            >
                                <img src={user.picture} height={40} width={40} alt={user.name} className='rounded-full' />
                                <div>
                                    <p className='capitalize'>{user.name}</p>
                                    <p className='text-sm'>{user.email}</p>
                                </div>
                            </div>
                        ))}
                </div>
                <button
                    onClick={() => handleRemove(user)}
                    type='button'
                    className='bg-red-600 text-gray-100 border border-black px-6 mx-auto p-2 rounded-full font-semibold hover:bg-red-700'>
                    Leave Chat
                </button>
            </div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseModal}>
                <div className="absolute inset-0 bg-neutral-800 opacity-75"></div>
            </div>
        </div>)
}

export default UpdateGroupChatModal