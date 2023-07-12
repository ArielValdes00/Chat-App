export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) {
        return null;
    }
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};
