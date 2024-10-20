import { useState, useEffect } from 'react';
import {
    Flex,
    Image,
    Spacer,
    Tabs,
    TabList,
    Tab,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [roleId, setRoleId] = useState(null); // Thêm state để lưu role_id

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập và lấy role_id (ví dụ: từ localStorage)
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsLoggedIn(true);
            setRoleId(user.role_id); // Lưu role_id vào state
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Flex bg="white" p={4} alignItems="center" justifyContent="space-between">
            <NavLink to="/"> {/* Thay đổi đường dẫn mặc định */}
                <Image src="/logo.png" alt="Logo" boxSize="50px" />
            </NavLink>
            <Spacer />

            {isLoggedIn ? (
                <>
                    {roleId === 1 && ( // User
                        <Tabs variant="unstyled">
                            <TabList>
                                <NavLink to="/homepage">
                                    <Tab _selected={{ color: 'blue.500' }}>Home</Tab>
                                </NavLink>
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
                    )}
                    {roleId === 3 && ( // Customer
                        <Tabs variant="unstyled">
                            <TabList>
                                <NavLink to="/customerhomepage">
                                    <Tab _selected={{ color: 'blue.500' }}>Home</Tab>
                                </NavLink>
                                {/* Thêm các tab khác cho customer */}
                                <NavLink to="/product">
                                    <Tab _selected={{ color: 'blue.500' }}>Product</Tab>
                                </NavLink>
                                <NavLink to="/service">
                                    <Tab _selected={{ color: 'blue.500' }}>Service</Tab>
                                </NavLink>
                                <NavLink to="/myproduct">
                                    <Tab _selected={{ color: 'blue.500' }}>My Product</Tab>
                                </NavLink>
                                <NavLink to="/myservice">
                                    <Tab _selected={{ color: 'blue.500' }}>My Service</Tab>
                                </NavLink>
                            </TabList>
                        </Tabs>
                    )}
                    {roleId === 2 && ( // Admin
                        <Tabs variant="unstyled">
                            <TabList>
                                <NavLink to="/adminhomepage">
                                    <Tab _selected={{ color: 'blue.500' }}>Home</Tab>
                                </NavLink>
                                {/* Thêm các tab khác cho admin */}
                                <NavLink to="/admin/users">
                                    <Tab _selected={{ color: 'blue.500' }}>Users</Tab>
                                </NavLink>
                                <NavLink to="/admin/customers">
                                    <Tab _selected={{ color: 'blue.500' }}>Customers</Tab>
                                </NavLink>
                                <NavLink to="/admin/allproducts">
                                    <Tab _selected={{ color: 'blue.500' }}>All Products</Tab>
                                </NavLink>
                                <NavLink to="/admin/allservices">
                                    <Tab _selected={{ color: 'blue.500' }}>All Services</Tab>
                                </NavLink>
                            </TabList>
                        </Tabs>
                    )}
                    <Spacer />
                    <Menu>
                        <MenuButton as={Button}>Setting</MenuButton>
                        <MenuList>
                            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                        </MenuList>
                    </Menu>
                </>
            ) : (
                <Tabs variant="unstyled">
                    <TabList>
                        <NavLink to="/login">
                            <Tab _selected={{ color: 'blue.500' }}>Đăng nhập</Tab>
                        </NavLink>
                        <NavLink to="/register">
                            <Tab _selected={{ color: 'blue.500' }}>Đăng ký</Tab>
                        </NavLink>
                    </TabList>
                </Tabs>
            )}
        </Flex>
    );
};

export default Navbar;