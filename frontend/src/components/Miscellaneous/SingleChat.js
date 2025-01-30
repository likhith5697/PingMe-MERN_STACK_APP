import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Text, Box, Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { getSender, getSenderFull } from '../../config/chatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import '../../components/styles.css';
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const toast = useToast();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const socket = useRef();
    const typingTimeout = useRef();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            socket.current.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: "Failed to load messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.current = io(ENDPOINT);
        socket.current.emit('setup', user);
        socket.current.on('connection', () => setSocketConnected(true));

        socket.current.on('typing', () => setIsTyping(true));
        socket.current.on('stop typing', () => setIsTyping(false));

        socket.current.on("Message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        });

        return () => {
            socket.current.off('Message received');
            socket.current.off('typing');
            socket.current.off('stop typing');
        };
    }, [user, selectedChatCompare, notification, fetchAgain]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.current.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.post("http://localhost:5000/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                socket.current.emit("send message", data);
                setMessages((prevMessages) => [...prevMessages, data]);
                setNewMessage("");
            } catch (error) {
                toast({
                    title: "Error occurred, failed to send message",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.current.emit("typing", selectedChat._id);
        }

        clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            socket.current.emit("stop typing", selectedChat._id);
            setTyping(false);
        }, 3000);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Box
                        fontSize={{ base: "20px", md: "24px" }}
                        pb={2}
                        px={2}
                        w="100%"
                        h="25%"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        color="white"
                        bg="#6a0dad" // Purple background for chat header
                        p={1}
                        borderRadius="lg"
                    >
                        <Box d="flex" alignItems="center">
                            <IconButton
                                d={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat(null)}
                                bg="#ffcc00" // Yellow background for button
                                _hover={{ bg: "#e6ac00" }}
                                color="black"
                                mr={4} // Add margin-right for spacing
                            />
                            <Text flex="1" textAlign="center">
                                {!selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                                    </>
                                )}
                            </Text>
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        p={3}
                        bg="#d9b3ff" // Light purple background for chat box
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner size={"xl"} w={20} h={20} alignSelf={"center"} margin={"auto"} />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? <div>Typing ...</div> : null}
                            <Input
                                variant={"filled"}
                                bg={"#e6e6fa"} // Light lavender input background
                                placeholder="Enter a message.."
                                onChange={typingHandler}
                                value={newMessage}
                                color="black"
                                _placeholder={{ color: "gray.500" }}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="100%"
                    w="100%"
                    bg="#d9b3ff" // Light gray background to match the theme
                    p={5} // Add padding for better spacing
                    borderRadius="lg" // Rounded corners for a modern look
                >
                    <Text
                        fontSize="2xl" // Adjust font size to fit the box
                        fontFamily="Work sans"
                        color="#6a0dad" // Purple text color
                        textAlign="center" // Center align text
                    >
                        Click on a user to start chatting
                    </Text>
                </Box>

            )}
        </>
    );
};

export default SingleChat;
