import React, { useState, useEffect } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import chatLoading from "./chatLoading";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/chatLogics";
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const [loggedUser, setLoggedUser] = useState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get("http://localhost:5000/api/chat", config);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error occurred",
                description: "Failed to load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    const renderChats = (chatList) => {
        if (!chatList) return null;

        if (!Array.isArray(chatList)) {
            chatList = Object.values(chatList);
        }

        return chatList.map((chat) => (
            <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                color={selectedChat === chat ? "white" : "black"}
                bg={selectedChat === chat ? "#6a0dad" : "#e6e6fa"}  // Purple for selected, light lavender for other chats
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
            >
                <Text>
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
            </Box>
        ));
    };

    return (
        <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="#f5f5f5"  // Light gray background for the container
            width={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="#6a0dad"  // Purple border
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                d="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                color="#6a0dad"  // Purple text color for header
            >
                <Text>My Chats</Text>
                <GroupChatModal>
                    <Button
                        fontSize={{ base: "17px", md: "18px", lg: "20px" }}
                        rightIcon={<AddIcon />}
                        bg="#6a0dad"  // Purple button background
                        color="white"
                        _hover={{ bg: "#53157a" }}  // Darker purple on hover
                        ml={4}  // Margin left to add space between the header and button
                        alignSelf="center"  // Aligns the button to the center vertically
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                d="flex"
                flexDir="column"
                p={3}
                bg="#e0e0e0"  // Light gray background for chat list
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY={"scroll"}>
                        {renderChats(chats)}
                    </Stack>
                ) : (
                    <chatLoading />
                )}
            </Box>
        </Box>
    );
}

export default MyChats;
