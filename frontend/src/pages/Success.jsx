import React from 'react';
import { Heading, Container, Box, Text } from '@chakra-ui/react';
import Navbar from './components/NavBar';
import Footer from './components/Footer';

const Success = () => {
    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    <Heading as="h1" size="xl" mb={4}>
                        Thanh toán thành công
                    </Heading>
                    <Text>Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.</Text>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Success;