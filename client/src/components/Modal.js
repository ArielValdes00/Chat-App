import React from 'react'
import CloseModal from '../../public/icons/close-modal.png';
import Edit from '../../public/icons/edit.png';
import Image from 'next/image';
import { ChatState } from '@/context/ChatProvider';
import { getUserInfoFromServer, uploadImage } from '@/utils/apiChats';

const Modal = ({ userInfo, handleCloseModal }) => {
    const { user, setUser } = ChatState();

    const handleUploadInput = async (e) => {
        const imageFile = e.target.files[0];
        const response = await uploadImage(imageFile, user);

        if (response) {
            console.log('Profile picture updated');
            const userInfo = await getUserInfoFromServer(user);

            setUser(userInfo);

            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } else {
            console.error('An error occurred while updating the profile picture');
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center w-full'>
            <div className='absolute bg-white p-4 rounded-xl shadow-lg z-10 relative px-16'>
                <div className='mb-10'>
                    <Image onClick={handleCloseModal}
                        src={CloseModal} height={28}
                        width={28}
                        alt='Close'
                        className='cursor-pointer absolute right-3 top-3'
                    />
                </div>
                <div className='flex flex-col gap-3 items-center text-4xl'>
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
                                    <Image src={Edit} height={20} width={20} alt='Change Picture' />
                                </label>
                            </div>
                            <p className='capitalize'>{userInfo.name}</p>
                            <p>{userInfo.email}</p>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-3 items-center'>
                            <img src={userInfo.picture}
                                height={250}
                                width={250}
                                alt={userInfo.name} className='rounded-full profile-img-modal'
                            />
                            <p className='capitalize'>{userInfo.name}</p>
                            <p>{userInfo.email}</p>
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
