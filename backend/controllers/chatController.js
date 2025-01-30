const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId is not sent through request");
        return res.sendStatus(400);
    }


    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } }, //checks the user array in db whether it contains current logged in user id
            { users: { $elemMatch: { $eq: userId } } }, //checks the user array in db whether it contains the user id that is sent through body to find chat
        ]
    }).populate("users", "-password").populate("latestMessage");



    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200);
            res.send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
})




const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",

                })
                res.status(200).send(results);
            })
    }
    catch (error) {
        res.Status(400);
        throw new Error(error.message);
    }
})



const createGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.groupName) {
        return res.status(400).send({
            message: "Please fill all the fields"
        });
    }

    let users = JSON.parse(req.body.users);
    const groupName = req.body.groupName;

    if (users.length < 2) {
        return res.status(400).send({
            message: "A minimum of 2 users are needed to create a new group"
        });
    }

    // Avoid adding the admin user if already present
    if (!users.includes(req.user._id)) {
        users.push(req.user._id);
    }

    try {
        const groupChat = await Chat.create({
            chatName: groupName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(500).send({
            message: "Error creating group chat",
            error: error.message
        });
    }
});

module.exports = createGroupChat;




const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        }, {
        new: true,
    }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(400);
        throw new Error("Chat not Found");
    }
    else {
        res.json(updatedChat);
    }
})


const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId } // push the new USER into the users array in the chatModel
        },
        {
            new: true
        }
    ).populate("users", "-password").populate("groupAdmin", "-password")

    if (!added) {
        res.status(400);
        throw new Error("Cannot be added to group");
    }
    else {
        res.status(200);
        res.json(added);
    }
})


const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId } // remove that user from the users array in the CHATMODEL (i.e., chat)
        },
        {
            new: true
        }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!removed) {
        res.status(400);
        throw new Error("Cannot be added to group");
    }
    else {
        res.status(200);
        res.json(removed);
    }
})









module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };