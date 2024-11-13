//Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Flex, Image,
    Input,
    Radio,
    RadioGroup,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import PasswordInput from './components/PasswordInput';

const Register = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState(1); // Thêm state cho role_id


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username, 
                    password: password, 
                    email: email, 
                    role_id: roleId 
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast({
                    title: 'Đăng ký thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/login');
            } else {
                toast({
                    title: 'Lỗi!',
                    description: data.message || 'Đã có lỗi xảy ra.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            toast({
                title: 'Lỗi!',
                description: 'Lỗi kết nối đến server.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex
            width="100vw"
            height="100vh"
            bg="#FAA42D"
            justifyContent="center"
            alignItems="center"
        >
            <Flex bg="#FFF3E1" // Background màu #FFF3E1 cho box
                  borderRadius="48px" // Border radius 48px
                  p="50px" // Padding cho box
                  width="80vw" // Điều chỉnh chiều rộng của box
                  justifyContent="space-between" // Căn chỉnh các element con
                  alignItems="center"
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={7} width="100%" minWidth="300px"
                    >
                        <Text
                            fontSize="48" fontFamily="Poppins"
                            color="#1A4742"
                            fontStyle={"normal"} fontWeight={"500"}
                            lineHeight={"37px"} letterSpacing={"2px"}
                        >
                            Let's get you a home
                        </Text>

                        <Input
                            placeholder="Name"
                            size="lg"
                            variant="outline"
                            bg={"white"}
                            borderRadius={58}
                            border="1px"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            placeholder="Email"
                            size="lg"
                            variant="outline"
                            bg={"white"}
                            borderRadius={58}
                            border="1px"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <RadioGroup
                            defaultValue={1}
                            mt={4}
                            value={roleId}
                            onChange={(value) => setRoleId(parseInt(value, 10))}
                        >
                            <Flex gap={10} fontSize="lg">
                                <Radio value={1}>user</Radio>
                                <Radio value={2}>admin</Radio>
                                <Radio value={3}>customer</Radio>
                            </Flex>
                        </RadioGroup>

                        <Button
                            bg={"#F4BC43"}
                            size="lg"
                            borderRadius={58}
                            variant='link'
                            type="submit"
                        >
                            Sign Up
                        </Button>

                        <Text fontSize="larger" fontFamily="Poppins"
                              color="#1A4742"
                              fontStyle={"normal"} fontWeight={"500"}
                              lineHeight={"37px"} letterSpacing={"-1.44px"}
                        >
                            Already have an account?
                        </Text>

                        <Button
                            bg={"#F4BC43"}
                            size="lg"
                            borderRadius={58}
                            variant='link'
                            onClick={() => navigate('/login')} // Chuyển đến trang đăng nhập
                        >
                            Log In
                        </Button>
                    </Stack>
                </form>

                <Flex direction="row" gap="20px">
                    <Box w="300px" h="300px">
                        <Image src='/logo.png' alt='logo'/>
                    </Box>
                    <Box w="300px" h="300px">
                        <Image src='/word_logo.png' alt='word_logo'/>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Register;