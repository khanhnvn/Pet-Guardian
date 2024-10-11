import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Image,
    Spacer,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Text,
    VStack,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

const Reminder = () => {
    return (
        <Box bg="#FFFCF8" minHeight="100vh"
             display="flex" flexDirection="column"
        > {/* Đặt màu nền cho trang */}
            {/* Navigation Bar */}
            <Navbar />

            {/* Body */}
            <Box flex={1}>
                <Container maxW="container.lg" p={4} flex={1}>
                    <VStack spacing={4} alignItems="flex-start">
                        <Heading as="h1" size="xl">
                            Welcome to Pet Guardian!
                        </Heading>
                        {/* Thêm nội dung cho body ở đây */}
                        <Text>Đây là chức năng hẹn lịch khám thú y </Text>
                    </VStack>
                </Container>
            </Box>

            {/* Footer */}
            <Footer />
        </Box>
    );
};

export default Reminder;