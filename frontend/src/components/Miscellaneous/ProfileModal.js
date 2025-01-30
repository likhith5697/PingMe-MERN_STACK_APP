import React from 'react';
import {
    IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, ModalFooter, Button, Text, Image
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                    colorScheme="purple"
                />
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h={"410px"} bg="#F5F5F5">
                    <ModalHeader
                        fontSize={"40px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                        color="#6a0dad"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        p={4}
                    >
                        <Image
                            src={user.pic}
                            alt={user.name}
                            borderRadius={"full"}
                            boxSize={"150px"}
                            mb={4}
                        />
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily={"Work sans"}
                            color="#333"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="purple"
                            mr={3}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProfileModal;
