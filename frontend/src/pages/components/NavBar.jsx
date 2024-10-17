// Navbar.jsx
import {
    Flex,
    Image,
    Spacer,
    Tabs,
    TabList,
    Tab,
    Button,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa thông tin đăng nhập khỏi localStorage hoặc sessionStorage
        // Ví dụ: localStorage.removeItem('user');

        // Chuyển hướng đến trang đăng nhập
        navigate('/login');

        onClose(); // Đóng modal
    };

    return (
        <Flex bg="white" p={4} alignItems="center" justifyContent="space-between">
            <NavLink to="/homepage">
                <Image src="/logo.png" alt="Logo" boxSize="50px" />
            </NavLink>
            <Spacer />
            <Tabs variant="unstyled">
                <TabList>
                    <NavLink to="/pet">
                        <Tab _selected={{ color: 'blue.500' }}>Pet</Tab>
                    </NavLink>
                    <NavLink to="/vet">
                        <Tab _selected={{ color: 'blue.500' }}>Veterinarian Contact</Tab>
                    </NavLink>
                    <NavLink to="/product">
                        <Tab _selected={{ color: 'blue.500' }}>Product</Tab>
                    </NavLink>
                    <NavLink to="/service">
                        <Tab _selected={{ color: 'blue.500' }}>Service</Tab>
                    </NavLink>
                    <NavLink to="/reminder">
                        <Tab _selected={{ color: 'blue.500' }}>Reminder</Tab>
                    </NavLink>
                </TabList>
            </Tabs>
            <Spacer />
            <Button onClick={onOpen}>Setting</Button> {/* Mở modal khi ấn Setting */}

            {/* Modal Setting */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Setting</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Button colorScheme="red" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default Navbar;