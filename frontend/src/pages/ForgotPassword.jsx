import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    Input,
    Stack,
    Text,
    Image,
    useToast,
} from "@chakra-ui/react";

const ForgotPassword = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(''); // Thêm state cho mã xác thực
    const [showVerificationInput, setShowVerificationInput] = useState(false); // State để hiển thị input mã xác thực
    const [isSendingCode, setIsSendingCode] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSendingCode(true); // Vô hiệu hóa nút
        try {
            const response = await fetch('/api/forgot_password', { // Gọi API forgot password
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            if (response.ok) {
                toast({
                    title: 'Gửi mã xác thực thành công!',
                    description: 'Vui lòng kiểm tra email của bạn.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setShowVerificationInput(true); // Hiển thị input mã xác thực
            } else {
                const errorData = await response.json();
                toast({
                    title: 'Lỗi!',
                    description: errorData.message || 'Email không tồn tại.',
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
        } finally {
            setIsSendingCode(false); // Kích hoạt lại nút
        }
    };

    const handleVerifyCode = () => {
        // Chuyển hướng đến trang ChangePassword và truyền email và verificationCode
        navigate('/changepassword', { state: { email, verificationCode } });
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
                            Forgot your password?
                        </Text>

                        <Input placeholder="Email" size="lg" variant="outline"
                               bg={"white"} borderRadius={58} border="1px"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button bg={"#F4BC43"} size="lg" borderRadius={58}
                                variant='link'
                                type="submit"
                                isLoading={isSendingCode} // Vô hiệu hóa nút khi đang gửi
                        >
                            Send verification code
                        </Button>

                        {showVerificationInput && ( // Hiển thị input mã xác thực
                            <>
                                <Input placeholder="Verification code" size="lg" variant="outline"
                                       bg={"white"} borderRadius={58} border="1px"
                                       value={verificationCode}
                                       onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <Button bg={"#F4BC43"} size="lg" borderRadius={58}
                                        variant='link'
                                        onClick={handleVerifyCode}
                                >
                                    Verify
                                </Button>
                            </>
                        )}
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

export default ForgotPassword;