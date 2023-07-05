import axios from "axios";

export const getChats = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}`);
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

