import React from 'react'
import CloseModal from '../../public/icons/close-modal.png';
import Image from 'next/image';
import { ChatState } from '@/context/ChatProvider';

const Modal = ({ userInfo, handleCloseModal }) => {
    const { user } = ChatState();

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
                        <p>se edita papaaaa</p>
                    ) : (
                        <div className='flex flex-col gap-3 items-center'>
                            <img src={userInfo.picture}
                                height={250}
                                width={250}
                                alt={userInfo.name} className='rounded-full'
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