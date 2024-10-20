// CustomerHomePage.jsx
import {
    Box,
    Heading,
    Text,
    VStack,
    Container,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const CustomerHomePage = () => {
    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    <VStack spacing={4} alignItems="flex-start">
                        <Heading as="h1" size="xl">
                            Welcome to your Customer Dashboard!
                        </Heading>
                        <Text>
                            {/* Thêm thông tin hoặc hướng dẫn cho customer */}
                            Bạn có thể quản lý sản phẩm, dịch vụ và xem báo cáo doanh thu tại đây.
                        </Text>
                        {/* Thêm các component hoặc liên kết đến các chức năng của customer */}
                    </VStack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default CustomerHomePage;