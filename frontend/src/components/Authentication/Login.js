import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, InputGroup, InputRightElement, Button, Input, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user/login", { email, password }, config);
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chatpage");
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const getCreds = () => {
        setEmail("guest@pingme.com");
        setPassword("guest123");
    }

    return (
        <VStack spacing={'5px'} color={"white"} bg={"#6a0dad"} p={5} borderRadius={"md"} boxShadow={"lg"}>
            <FormControl id='email' isRequired>
                <FormLabel color={"white"}>Email</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    focusBorderColor={"#ffcc00"}
                    bg={"#d9b3ff"}
                    _placeholder={{ color: "gray.500" }}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel color={"white"}>Password</FormLabel>
                <InputGroup>
                    <Input
                        value={password}
                        type={show ? "text" : 'password'}
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                        focusBorderColor={"#ffcc00"}
                        bg={"#d9b3ff"}
                        _placeholder={{ color: "gray.500" }}
                    />
                    <InputRightElement>
                        <Button h={"1.75rem"} size={"sm"} onClick={handleClick} bg={"#ffcc00"} _hover={{ bg: "#e6ac00" }}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme='yellow' width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                Login
            </Button>
            <Button variant="solid" colorScheme='purple' width={"100%"} onClick={getCreds}>
                Get Guest User Credentials
            </Button>
        </VStack>
    );
}

export default Login;
