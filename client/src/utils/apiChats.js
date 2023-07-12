import axios from "axios";

export const getChats = async (user) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}`, config);
        if(!response){
            console.log("no chats available");
            return [];
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return[];
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


