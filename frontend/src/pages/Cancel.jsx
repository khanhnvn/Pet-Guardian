import React from 'react';
import { Heading, Container, Box } from '@chakra-ui/react';
import Navbar from './components/NavBar';
import Footer from './components/Footer';

const Cancel = () => {
    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    <Heading as="h1" size="xl" mb={4}>
                        Thanh toán bị hủy
                    </Heading>
                    <Text>Bạn đã hủy thanh toán. Vui lòng thử lại hoặc liên hệ với chúng tôi nếu bạn cần hỗ trợ.</Text>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Cancel;