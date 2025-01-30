import React, { useState, useEffect } from 'react';
import {
    Box, Button, Menu, Text, Tooltip, MenuItem, MenuButton, MenuList,
    Drawer, DrawerOverlay, DrawerContent, DrawerBody, Input, DrawerHeader,
    useToast, Spinner, Avatar, Badge
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000'; // Your server endpoint
let socket;

const SideDrawer = () => {
    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            socket = io(ENDPOINT);
            socket.emit('setup', user);

            // Listen for new messages
            socket.on('message received', (newMessage) => {
                // Update the notification state with the new message
                setNotification((prev) => [newMessage, ...prev]);
            });
        }
    }, [user, navigate]);

    useEffect(() => {
        console.log(notification);
    }, [notification]);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter email or name to search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("http://localhost:5000/api/chat", { userId }, config);
            setSelectedChat(data);
            setLoadingChat(false);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
            setLoadingChat(false);
        }
    };

    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bg={"#6a0dad"}  // Purple background
                w={"100%"}
                p={"5px 10px 5px 10px"}
                borderWidth={"3px"}
                borderColor={"#6a0dad"}  // Purple border
                color={"white"}  // White text
            >
                <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
                    <Button variant={"ghost"} onClick={onOpen} colorScheme="whiteAlpha">
                        <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px={"4"}>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"} fontFamily={"Work sans"}>Ping me</Text>
                <div>
                    <Menu>
                        <MenuButton p={1} m={1} position="relative">
                            <BellIcon fontSize="2xl" />
                            {notification.length > 0 && (
                                <Badge
                                    position="absolute"
                                    top="-1px"
                                    right="-1px"
                                    fontSize="0.8em"
                                    colorScheme="red"
                                    borderRadius="full"
                                    px={2}
                                    py={1}
                                >
                                    {notification.length}
                                </Badge>
                            )}
                        </MenuButton>

                        <MenuList
                            maxH="300px"
                            overflowY="auto"
                            boxShadow="lg"
                            border="1px solid"
                            borderColor="gray.200"
                            bg="white" // Ensure the background of the MenuList is white or a light color for better contrast
                        >
                            {notification.length === 0 ? (
                                <MenuItem bg="white" color="gray.500">No new messages</MenuItem> // Adjust text color for no notifications
                            ) : (
                                notification.map((notif) => (
                                    <MenuItem
                                        key={notif._id}
                                        bg="purple.100" // Light purple background for notifications
                                        color="black" // Text color for notifications
                                        _hover={{ bg: "purple.200" }} // Darker purple on hover
                                        onClick={() => {
                                            setSelectedChat(notif.chat); // Set the chat as selected
                                            setNotification(notification.filter((n) => n._id !== notif._id)); // Remove the notification after clicking
                                        }}
                                    >
                                        {"New message from " + notif.sender.name}
                                    </MenuItem>
                                ))
                            )}
                        </MenuList>



                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList bg="#F5F5F5" borderColor="purple.500">
                            <ProfileModal user={user}>
                                <MenuItem

                                    bg="purple.100" // Light purple background for notifications
                                    color="black" // Text color for notifications
                                    _hover={{ bg: "purple.200" }} >
                                    My Profile
                                </MenuItem>
                            </ProfileModal>
                            <MenuItem
                                onClick={logoutHandler}
                                bg="purple.100" // Light purple background for notifications
                                color="black" // Text color for notifications
                                _hover={{ bg: "purple.200" }}
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"} color="#6a0dad">
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display={"flex"} pb={2}>
                            <Input
                                placeholder='Search by email or name'
                                value={search}
                                mr={2}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch} bg="#6a0dad" color="white" _hover={{ bg: "#53157a" }}>
                                Go
                            </Button>
                        </Box>

                        {loading ? (
                            <Spinner />
                        ) : (
                            searchResult?.map((user1) => (
                                <UserListItem
                                    key={user1._id}
                                    user={user1}
                                    handleFunction={() => accessChat(user1._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default SideDrawer;
