import React from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import Login from "../components/Authentication/Login"
import Signup from "../components/Authentication/SignUp"
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const HomePage = () => {


    // const navigate = useNavigate();
    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem("userInfo"));
    //     if (user) {
    //         console.log(user);
    //         navigate("/chatpage");
    //     }
    // }, []);


    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="Work sans">
                    Ping - me
                </Text>
            </Box>
            <Box bg={"white"} w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"} color={"black"}>
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList mb={"1em"}>
                        <Tab width={"50%"}>Login</Tab>
                        <Tab width={"50%"}>SignUp</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage