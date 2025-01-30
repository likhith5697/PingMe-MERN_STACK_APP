import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, InputGroup, InputRightElement, Button, Input, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dncei09yd");
            fetch("https://api.cloudinary.com/v1_1/dncei09yd/image/upload", {
                method: 'post',
                body: data
            }).then((response) => response.json()).then(data => {
                setPic(data.url.toString());
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            });
        } else {
            toast({
                title: "Please select a valid image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
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

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
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
            const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
            toast({
                title: "Registration successful",
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
                title: "Error occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing={'5px'} color={"white"} bg={"#6a0dad"} p={5} borderRadius={"md"} boxShadow={"lg"}>
            <FormControl id='name' isRequired>
                <FormLabel color={"white"}>Name</FormLabel>
                <Input
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    focusBorderColor={"#ffcc00"}
                    bg={"#d9b3ff"}
                    _placeholder={{ color: "gray.500" }}
                />
            </FormControl>
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
                        type={show ? "text" : 'password'}
                        placeholder='Enter your password'
                        value={password}
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
            <FormControl id='confirm-password' isRequired>
                <FormLabel color={"white"}>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : 'password'}
                        placeholder='Confirm your password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
            <FormControl id='pic'>
                <FormLabel color={"white"}>Upload your Picture</FormLabel>
                <Input
                    type={"file"}
                    p={"1.5"}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                    bg={"#d9b3ff"}
                />
            </FormControl>
            <Button colorScheme='yellow' width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    );
};

export default SignUp;
