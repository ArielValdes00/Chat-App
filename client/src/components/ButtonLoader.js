import React from 'react';
import { LuLoader2 } from "react-icons/lu";

const ButtonLoader = ({ isLoading, textSubmit, textButton }) => {
    return (
        <button
            type="submit"
            className="w-full p-3 py-2 bg-blue-600 rounded-md shadow text-white text-xl font-bold hover:bg-blue-700"
            disabled={isLoading}
        >
            {isLoading ? (
                <div className='flex items-center gap-2 justify-center'>
                    <LuLoader2 size={20} className='text-white animate-spin' />
                    <span>{textSubmit}</span>
                </div>
            ) : (
                <span>{textButton}</span>
            )}
        </button>
    )
}

export default ButtonLoader