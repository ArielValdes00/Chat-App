import React from 'react';

const EmojiPanel = ({ onSelect, targetInput }) => {
    const emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆','🦖', '🚀', '🚗', '🚲', '🛵', '🛴', '🛹', '🛬', '🛳️', '🚁', '🚂', '🚆'];

    return (
        <div className='flex flex-wrap absolute top-0 bg-gray-200 border'>
            {emojis.map(emoji => (
                <button
                    key={emoji}
                    onClick={() => onSelect(emoji, targetInput)}
                    className='rounded-md cursor-pointer'
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
}

export default EmojiPanel;
