import React, { useState } from 'react'
import { FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);


    const toast = useToast();



    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            // const { data } = await axios.get(`http://localhost:5000/api/user/?search=${search}`, config);
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResults(data);
            console.log((data));
        } catch (error) {
            toast({
                title: "Error occured !",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("http://localhost:5000/api/chat/group", {
                groupName: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);


            setChats(data, ...chats);
            setLoading(false);
            onClose();
            toast({
                title: "New group chat is created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }

    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already exists",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]); // add the new user details to the selectedUsers array by keeping already the existing users in it(...selectedUsers)
    }

    // Add only the users whose id is not needed to be deleted to the  selectedUsers array 
    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id))
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >Create group chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        alignItems={"center"}
                        flexDir={"column"}
                    >
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        <Box>
                            {selectedUsers.map((u) => (
                                <UserBadgeItem key={user._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>



                        {loading ? <div>loading</div> : (
                            searchResults.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            ))
                        )}


                        {/* render Searched users */}
                    </ModalBody>



                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create group chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal