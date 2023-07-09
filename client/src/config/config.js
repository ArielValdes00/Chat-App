export const getSender = (loggedUser, users) => {
    if (users && users.length > 1 && loggedUser && loggedUser._id) {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    }
    return null; 
};
