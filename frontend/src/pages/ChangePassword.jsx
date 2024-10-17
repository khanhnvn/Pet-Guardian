import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    Stack,
    Text,
    Image,
    useToast,
} from "@chakra-ui/react";
import PasswordInput from './components/PasswordInput';

const ChangePassword = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { email, verificationCode } = location.state || {}; // Lấy email và mã xác thực từ location state, xử lý trường hợp undefined

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state để xác nhận mật khẩu

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) { // Kiểm tra mật khẩu trùng khớp
            toast({
                title: 'Lỗi!',
                description: 'Mật khẩu không trùng khớp.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetch('/api/change_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    verificationCode: verificationCode,
                    newPassword: newPassword
                }),
            });

            if (response.ok) {
                toast({
                    title: 'Đổi mật khẩu thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/login');
            } else {
                const errorData = await response.json();
                toast({
                    title: 'Lỗi!',
                    description: errorData.message || 'Mã xác thực không đúng.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Lỗi:', error);
            toast({
                title: 'Lỗi!',
                description: 'Đã có lỗi xảy ra.',
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
            <Flex bg="#FFF3E1"
                  borderRadius="48px"
                  p="90px"
                  width="80vw"
                  justifyContent="space-between"
                  alignItems="center"
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={7} width="100%" minWidth="300px">
                        <Text
                            fontSize="48" fontFamily="Poppins"
                            color="#1A4742"
                            fontStyle={"normal"} fontWeight={"500"}
                            lineHeight={"48px"} letterSpacing={"-1.44px"}
                        >
                            Change Password
                        </Text>

                        <PasswordInput
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password" // Thêm placeholder
                        />

                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password" // Thêm placeholder
                        />

                        <Button bg={"#F4BC43"} size="lg" borderRadius={58}
                                variant='link'
                                type="submit"
                        >
                            Change Password
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

export default ChangePassword;   