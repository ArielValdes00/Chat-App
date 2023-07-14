import React from 'react';

const EmojiPanel = ({ onSelect, targetInput, position }) => {
    const emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆','🦖', '🚀', '🚗', '🚲', '🛵', '🛴', '🛹', '🛬', '🛳️', '🚁', '🚂', '🚆'];

    return (
        <div className={`flex gap-1 flex-wrap absolute max-w-sm ${position} bg-gray-200 border border-black rounded-lg p-1`}>
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
