import React, { useState } from 'react'
import CloseModal from '../../public/icons/close-modal.png';
import { ChatState } from '@/context/ChatProvider';
import Image from 'next/image';
import axios from 'axios';
import Delete from '../../public/icons/delete-user.png';
import Loader from '../../public/icons/loader.gif';
import Edit from '../../public/icons/edit.png';
import { FaRegSmile } from 'react-icons/fa';
import EmojiPanel from './EmojiPanel.js';
import 'animate.css';

const GroupChatModel = ({ handleCloseModal }) => {
    const { user, chats, setChats, loader, setLoader } = ChatState();
    const [groupChatName, setGroupChatName] = useState("");
    const [groupChatImage, setGroupChatImage] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

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
            setLoader(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_USER_URL}?search=${search}`, config);
            setSearchResult(data);
            setLoader(false);
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
            handleCloseModal();

        } catch (error) {
            console.log(error)
        }
    };
    const groupImage = (e) => {
        const file = e.target.files[0];
        setGroupChatImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };


    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='w-5/6 sm:w-1/2 xl:w-[40%] absolute bg-white p-4 rounded-xl shadow-lg z-10 relative animate__animated animate__fadeIn'>
                <div className='mb-2'>
                    <Image onClick={handleCloseModal}
                        src={CloseModal} height={28}
                        width={28}
                        alt='Close'
                        className='cursor-pointer absolute right-3 top-3'
                    />
                </div>
                <p className='text-center text-2xl font-bold mb-4'>Create Group Chat</p>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center relative'>
                    <div className='flex items-center relative'>
                        <img
                            src={!groupChatImage ? "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" : previewImage}
                            alt={'user'}
                            className='rounded-full profile-img-modal'
                        />
                        <input
                            type="file"
                            onChange={(e) => groupImage(e)}
                            accept="image/*"
                            id="upload-button"
                            className="hidden"
                        />
                        <label
                            htmlFor="upload-button"
                        >
                            <Image src={Edit} height={20} width={20} alt='Change Picture' className='absolute ms-2' />
                        </label>
                    </div>
                    <div className='flex items-center gap-2 justify-center w-full flex-wrap'>
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
                    <div className='w-2/3 flex flex-col gap-2'>
                        <label htmlFor='groupChatName' className='text-center font-semibold'>Chat Name</label>
                        <div className='flex relative'>
                            {showEmojiPanel && <EmojiPanel onSelect={selectEmoji} targetInput="groupChatName" position={"top-0"} />}
                            <input
                                onChange={(e) => setGroupChatName(e.target.value)}
                                type='text'
                                placeholder='Your Chat Name'
                                className="border w-full rounded-lg p-2 ps-3 focus:outline-none focus:ring focus:border-blue-600"
                                name='groupChatName'
                                value={groupChatName}
                            />
                            <button type="button" onClick={toggleEmojiPanel} className="px-3 absolute top-[2px] right-[-50px]">
                                <FaRegSmile size={30} className={`bg-yellow-300 rounded-full mt-[4px] ${showEmojiPanel && "bg-yellow-400"}`} />
                            </button>
                        </div>
                    </div>
                    <div className='w-2/3 flex flex-col items-center gap-2'>
                        <label htmlFor='Users' className='text-center font-semibold'>Add Users</label>
                        <input
                            onChange={(e) => handleSearch(e.target.value)}
                            type='text'
                            placeholder='Add Users'
                            className="border w-full rounded-lg p-2 ps-3 focus:outline-none focus:ring focus:border-blue-600"
                        />
                    </div>
                    <div className='w-2/3 flex flex-col gap-2'>
                        <div className={`${search && "h-[104px]"} overflow-y-auto`}>
                            {loader
                                ? <Image src={Loader} height={30} width={30} alt='Loader' className='mx-auto'/>
                                : searchResult?.slice(0, 3).map((user) => (
                                    <div
                                        key={user._id}
                                        user={user}
                                        onClick={() => handleGroup(user)}
                                        className='flex items-center gap-3 py-1 ps-3 hover:bg-gray-100 cursor-pointer'
                                    >
                                        <img src={user.picture} height={40} width={40} alt={user.name} className='rounded-full' />
                                        <div>
                                            <p className='capitalize'>{user.name}</p>
                                            <p className='text-sm'><strong>Email: </strong>{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <button type='submit' className='bg-blue-600 border text-gray-100 font-semibold border-black px-5 mx-auto p-2 rounded-full hover:bg-blue-700'>Create Group</button>
                </form >
            </div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseModal}>
                <div className="absolute inset-0 bg-neutral-800 opacity-75"></div>
            </div>
        </div>
    )
}

export default GroupChatModel