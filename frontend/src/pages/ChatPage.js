import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import MyChats from '../components/Miscellaneous/MyChats';
import ChatBox from '../components/Miscellaneous/ChatBox';


const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    useEffect(() => {
        if (!user) {

        }
    }, [user]);

    return (
        <div style={{ width: "100%" }}>
            {console.log(user)}

            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="92.7vh"
                p="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
}

export default ChatPage;
