import React, { useState } from 'react'
import { Box, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text, Image, useToast, FormControl, Input, Spinner } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {


    const { selectedChat, setSelectedChat, user } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [searchresult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();


    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            console.log(user._id);
            console.log(selectedChat.groupAdmin._id);
            toast({
                title: "Only admin can remove users from group",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put("http://localhost:5000/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config
            );

            //If admin himself is removed by him, then no need to add the user to the selectedChat 
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error occured !",
                description: "Cannot remove from group",
                status: "Error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
        finally {
            setLoading(false);
        }


    }

    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('http://localhost:5000/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error occurred",
                description: error.response,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    }

    const handleAddUser = async (user1) => {
        // Check if user1 and user1._id are valid
        if (!user1 || !user1._id) {
            console.error("Invalid user object:", user1);
            toast({
                title: "Invalid user",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        // Check if selectedChat, selectedChat.users are valid
        if (!selectedChat || !selectedChat.users || !Array.isArray(selectedChat.users)) {
            console.error("Invalid selectedChat object:", selectedChat);
            toast({
                title: "Invalid chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        // Check if user is already in the group
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        console.log(user);
        console.log(selectedChat.groupAdmin);
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put(
                "http://localhost:5000/api/chat/groupadd",
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            toast({
                title: "User added successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        } catch (error) {
            console.error("Failed to add the user to group:", error);
            toast({
                title: "Failed to add the user to group",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    };


    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error occurred",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom - left"
            });
        }
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            {selectedChat.users.map(u => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>


                        <FormControl display={"flex"}>
                            <Input placeholder='Chat name' mb={1}
                                value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant={"solid"} colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                        </FormControl>


                        <FormControl display={"flex"}>
                            <Input placeholder='Add user to group' mb={1} onChange={(e) => handleSearch(e.target.value)}
                            />
                            {/* <Button variant={"solid"} colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleAdd}>Add Users</Button> */}
                        </FormControl>


                        {loading ? (<Spinner size={"lg"} />) : (
                            searchresult?.map((user) => (
                                <UserListItem user={user} handleFunction={() => handleAddUser(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red' >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal