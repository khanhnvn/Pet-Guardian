// AdminHomePage.jsx
import {
    Box,
    Heading,
    Text,
    VStack,
    Container,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const AdminHomePage = () => {
    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    <VStack spacing={4} alignItems="flex-start">
                        <Heading as="h1" size="xl">
                            Welcome to your Admin Dashboard!
                        </Heading>
                        <Text>
                            {/* Thêm thông tin hoặc hướng dẫn cho admin */}
                            Bạn có thể quản lý người dùng, sản phẩm, dịch vụ, giao dịch và thống kê tại đây.
                        </Text>
                        {/* Thêm các component hoặc liên kết đến các chức năng của admin */}
                    </VStack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default AdminHomePage;