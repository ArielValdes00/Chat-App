import axios from "axios";

export const getChats = async (user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}`, config);
        if (!response) {
            console.log("no chats available");
            return [];
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_USER_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        console.log(error);
        if (error) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An error occurred while logging in");
        }
    }
}

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_USER_URL}`, { name, email, password });
        return response.data;
    } catch (error) {
        console.log(error);
        if (error) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An error occurred while registering");
        }
    }
}

export const getUserInfoFromServer = async (user) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_USER_URL}/userInfo`, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    });

    return response.data;
}

export const getChatsFromServer = async (user) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}`, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    });

    return response.data;
}

export const uploadImage = async (imageFile, user) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(`${process.env.NEXT_PUBLIC_USER_URL}/updateimage`, formData, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    });

    return response;
}

export const updateGroupPicture = async (imageFile, user, chatId) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('chatId', chatId);

    const response = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/update-picture`, formData, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    });

    return response;
}

export const readMessages = async (chat, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        await axios.post(`${process.env.NEXT_PUBLIC_MESSAGE_URL}/read`, { chatId: chat._id }, config);
    } catch (error) {
        console.error(error);
    }
}

export const searchUsers = async (search, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.get(`${process.env.NEXT_PUBLIC_USER_URL}?search=${search}`, config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const createGroupChat = async (formData, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/group`, formData, config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const getAllUsers = async (user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.get(`${process.env.NEXT_PUBLIC_USER_URL}`, config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const selectChat = async (userId, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}`, { userId }, config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const getMessages = async (selectedChatId, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MESSAGE_URL}/${selectedChatId}`, config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const sendMessage = async (newMessage, selectedChatId, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.post(process.env.NEXT_PUBLIC_MESSAGE_URL,
            {
                content: newMessage,
                chatId: selectedChatId,
            },
            config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const deleteAllMessages = async (selectedChatId, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.put(`${process.env.NEXT_PUBLIC_MESSAGE_URL}/${selectedChatId}`, null, config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const deleteCurrentChat = async (selectedChatId, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/${selectedChatId}`, null, config);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const renameGroupChat = async (selectedChatId, groupChatName, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/rename`,
            {
                chatId: selectedChatId,
                chatName: groupChatName,
            },
            config
        );
        return response.data
    } catch (error) {
        console.error(error);
    }
}
export const removeUserFromChat = async (selectedChatId, user1Id, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/groupremove`,
            {
                chatId: selectedChatId,
                userId: user1Id,
            },
            config
        );
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const addUserToGroup = async (selectedChatId, user1Id, user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/groupadd`,
            {
                chatId: selectedChatId,
                userId: user1Id,
            },
            config
        );
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const resetPasswordRequest = async (email) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_USER_URL}/reset-password-request`, {
            email: email
        });
        console.log(response)

        return response.data;
    } catch (error) {
        throw error;
    }
};

