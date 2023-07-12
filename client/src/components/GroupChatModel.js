import React, { useState } from 'react'
import CloseModal from '../../public/icons/close-modal.png';
import { ChatState } from '@/context/ChatProvider';
import Image from 'next/image';
import axios from 'axios';
import Delete from '../../public/icons/delete-user.png';
import { FaRegSmile } from 'react-icons/fa';
import EmojiPanel from './EmojiPanel.js';

const GroupChatModel = ({ handleCloseModal }) => {
    const { user, chats, setChats } = ChatState();
    const [groupChatName, setGroupChatName] = useState("");
    const [groupChatImage, setGroupChatImage] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);

    const toggleEmojiPanel = () => {
        setShowEmojiPanel(prevState => !prevState);
    };

    const selectEmoji = (emoji, targetInput) => {
        setShowEmojiPanel(false);
        if (targetInput === 'groupChatName') {
            setGroupChatName(prevName => prevName + emoji);
        }
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            console.log("User Already Exits")
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_USER_URL}?search=${search}`, config);
            setSearchResult(data);
        } catch (error) {
            console.log(error)
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!groupChatName || !selectedUsers) {
            console.log("complete all fields")
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const formData = new FormData();
            formData.append('userId', user._id)
            formData.append('name', groupChatName);
            formData.append('users', JSON.stringify(selectedUsers.map((user) => user._id)));
            formData.append('image', groupChatImage);

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/group`, formData, config);
            setChats([...chats, data]);
            console.log(chats)

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center w-full'>
            <div className='absolute bg-white p-4 rounded-xl shadow-lg z-10 relative w-[400px] md:w-[500px] lg:w-[550px]'>
                <div className='mb-2'>
                    <Image onClick={handleCloseModal}
                        src={CloseModal} height={28}
                        width={28}
                        alt='Close'
                        className='cursor-pointer absolute right-3 top-3'
                    />
                </div>
                <p className='text-center text-2xl font-bold'>Create Group Chat</p>
                <form onSubmit={handleSubmit} className='flex flex-col gap-2 relative'>
                    <input
                        onChange={(e) => setGroupChatImage(e.target.files[0])}
                        type='file'
                        className='border p-1 ps-3'
                    />
                    <button type="button" onClick={toggleEmojiPanel} className="px-3">
                        <FaRegSmile size={30} />
                    </button>
                    {showEmojiPanel && <EmojiPanel onSelect={selectEmoji} targetInput="groupChatName" />}
                    <label htmlFor='Chat Name'>Chat Name</label>
                    <input
                        onChange={(e) => setGroupChatName(e.target.value)}
                        type='text'
                        placeholder='Your Chat Name'
                        className='border p-1 ps-3'
                        value={groupChatName}
                    />
                    <label htmlFor='Users'>Add Users</label>
                    <input
                        onChange={(e) => handleSearch(e.target.value)}
                        type='text'
                        placeholder='Add Users'
                        className='border p-1 ps-3'
                    />
                    <div className='flex items-center gap-4 flex-wrap'>
                        {selectedUsers.map((user) => (
                            <div key={user._id} className='border flex items-center justify-center bg-gray-200 gap-2 rounded-full px-3 cursor-pointer'>
                                <p className='capitalize'>{user.name}</p>
                                <Image
                                    src={Delete}
                                    height={10}
                                    width={10}
                                    alt='Delete'
                                    onClick={() => handleDelete(user)}
                                />
                            </div>
                        ))}
                    </div>
                    {searchResult?.slice(0, 3).map((user) => (
                        <div
                            key={user._id}
                            user={user}
                            onClick={() => handleGroup(user)}
                            className='flex items-center gap-3 p-1 py-2 ps-3 hover:bg-gray-100 cursor-pointer'
                        >
                            <img src={user.picture} height={40} width={40} alt={user.name} className='rounded-full' />
                            <div>
                                <p className='capitalize'>{user.name}</p>
                                <p className='text-sm'><strong>Email: </strong>{user.email}</p>
                            </div>
                        </div>
                    ))}
                    <button type='submit' className='mt-2 bg-gray-100 border border-black px-5 mx-auto p-2 rounded-full'>Create Group</button>
                </form >
            </div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseModal}>
                <div className="absolute inset-0 bg-neutral-800 opacity-75"></div>
            </div>
        </div>
    )
}

export default GroupChatModel