export const isValidName = (name) => {
    const nameRegex = /^[A-Za-z\s]{3,12}$/;
    return nameRegex.test(name);
};

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    const passwordRegex = /^[a-zA-Z0-9]{8,16}$/;
    return passwordRegex.test(password);
};
