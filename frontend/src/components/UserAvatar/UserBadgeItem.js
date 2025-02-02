import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius={"lg"}
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            backgroundColor="#6a0dad" // Dark purple background
            color={"white"}
            cursor={"pointer"}
            onClick={handleFunction}
            _hover={{ backgroundColor: "#9b59b6" }} // Slightly lighter purple on hover
        >
            {user.name}
            <CloseIcon pl={1} />
        </Box>
    );
}

export default UserBadgeItem;
