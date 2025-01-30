import { m } from "framer-motion";

export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) {
        return "";
    }
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users) => {
    if (!users || users.length < 2) {
        return "";
    }
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}



//checking if the last message is not being sent by same user
export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};


export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};



export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};


export const isSameUser = (messages, message, index) => {
    return index > 0 && messages[index - 1].sender._id === message.sender._id;
}