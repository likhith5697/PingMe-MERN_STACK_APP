import React from 'react';
import { Avatar, Box, Text } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import { isSameSender, isLastMessage, isSameSenderMargin } from '../../config/chatLogics';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <Box>
            {messages &&
                messages.map((message, index) => (
                    <Box key={message._id} display="flex" alignItems="center">
                        {(isSameSender(messages, message, index, user._id) ||
                            isLastMessage(messages, index, user._id)) && (
                                <Avatar
                                    size="sm"
                                    cursor="pointer"
                                    name={message.sender.name}
                                    src={message.sender.pic}
                                    marginRight={1}
                                    marginTop={2}
                                />
                            )}
                        <Text
                            bg={message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}
                            borderRadius="20px"
                            padding="5px 15px"
                            maxWidth="75%"
                            marginLeft={isSameSenderMargin(messages, message, index, user._id)} //if it is not same sender, then make margin of the messages to 0; such that loggedin user messages will be at the right of down chat
                            marginTop={isSameSender(messages, message, index, user._id) ? 2 : 6}
                        >
                            {message.content}
                        </Text>
                    </Box>
                ))}
        </Box>
    );
};

export default ScrollableChat;
