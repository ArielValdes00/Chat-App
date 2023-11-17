import React from 'react'
import { ChatState } from '@/context/ChatProvider';
import { getUserInfoFromServer, uploadImage } from '@/utils/apiChats';
import { IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import 'animate.css';

const Modal = ({ userInfo, handleCloseModal }) => {
    const { user, setUser } = ChatState();

    const handleUploadInput = async (e) => {
        const imageFile = e.target.files[0];
        const response = await uploadImage(imageFile, user);

        if (response) {
            const userInfo = await getUserInfoFromServer(user);

            setUser(userInfo);

            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } else {
            console.error('An error occurred while updating the profile picture');
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center w-full'>
            <div className='absolute bg-white p-4 rounded-xl shadow-lg z-10 relative w-5/6 sm:w-[60%] xl:w-[40%] animate__animated animate__fadeIn'>
                <div className='mb-5'>
                    <IoClose
                        size={30}
                        onClick={handleCloseModal}
                        className='cursor-pointer absolute right-3 top-3'
                    />
                </div>
                <div className='flex flex-col gap-3 items-center'>
                    {user === userInfo ? (
                        <div className='flex flex-col gap-3 items-center'>
                            <div className='flex items-center'>
                                <img src={userInfo.picture}
                                    height={250}
                                    width={250}
                                    alt={userInfo.name} className='rounded-full profile-img-modal mx-3'
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
                                    <FiEdit className='cursor-pointer' />
                                </label>
                            </div>
                            <p className='capitalize text-4xl'>{userInfo.name}</p>
                            <p className='text-md md:text-2xl'>{userInfo.email}</p>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-3 items-center'>
                            <img src={userInfo.picture}
                                height={250}
                                width={250}
                                alt={userInfo.name} className='rounded-full profile-img-modal'
                            />
                            <p className='capitalize text-4xl md:text-5xl'>{userInfo.name}</p>
                            <p className='text-md md:text-2xl'>{userInfo.email}</p>
                        </div>
                    )}

                </div>
            </div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseModal}>
                <div className="absolute inset-0 bg-neutral-800 opacity-75"></div>
            </div>
        </div>
    )
}

export default Modal
