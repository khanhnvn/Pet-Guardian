//CheckoutPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
Box,
Heading,
VStack,
Button,
Container,
useToast,
FormControl,
FormLabel,
Textarea,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ShipInfo from './components/ShipInfo';
import OrderInfo from './components/OrderInfo';

const CheckoutPage = () => {
const toast = useToast();
const navigate = useNavigate();
const location = useLocation();
const [cart, setCart] = useState([]);
const [selectedItems, setSelectedItems] = useState([]);
const [shippingFee] = useState(25000); 
const [recipientInfo, setRecipientInfo] = useState({
    name: '',
    phone: '',
    email: '',
});
const [shippingAddress, setShippingAddress] = useState({
    province: '',
    district: '',
    ward: '',
    street: '',
});
const [notes, setNotes] = useState('');

useEffect(() => {
    // Gọi API để lấy thông tin giỏ hàng
    const fetchCart = async () => {
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
            throw new Error('Lỗi khi lấy giỏ hàng');
        }
        const data = await response.json();
        setCart(data);
    } catch (error) {
        console.error('Lỗi:', error);
        toast({
            title: 'Lỗi!',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
    };

    fetchCart();
}, []); 

const handleRecipientInfoChange = (e) => {
    setRecipientInfo({ ...recipientInfo, [e.target.name]: e.target.value });
};

const handleShippingAddressChange = (address) => {
    setShippingAddress(address);
};

const handleNotesChange = (e) => {
    setNotes(e.target.value);
};

// Tính tổng giá tiền sản phẩm
const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price;
            return total + price * item.quantity;
    }, 0);
}, [cart]);

const handleCheckout = async () => {
    try {
        const response = await fetch('/api/cart/checkout', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            cart_item_ids: selectedItems,
            recipient_info: recipientInfo,
            shipping_address: shippingAddress,
            notes: notes,
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.checkoutUrl) {
                window.open(data.checkoutUrl, '_self');
            } else {
                toast({
                    title: 'Lỗi!',
                    description: 'Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            const errorData = await response.json();
            toast({
                title: 'Lỗi!',
                description: errorData.message || 'Lỗi khi thanh toán.',
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
    <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
    <Navbar />
    <Box flex={1}>
        <Container maxW="container.lg" p={10}>
        <Heading as="h1" size="xl" mb={4}>
            Thanh toán
        </Heading>

        <VStack spacing={4} align="stretch">
            <ShipInfo
            recipientInfo={recipientInfo}
            onRecipientInfoChange={handleRecipientInfoChange}
            shippingAddress={shippingAddress}
            onShippingAddressChange={handleShippingAddressChange}
            />

            <OrderInfo 
            cart={cart}
            totalPrice={totalPrice} 
            shippingFee={shippingFee} 
            />

            <FormControl mt={4}>
                <FormLabel>Ghi chú đơn hàng:</FormLabel>
                <Textarea value={notes} onChange={handleNotesChange} placeholder="Ghi chú đơn hàng của bạn" />
            </FormControl>

            <Button colorScheme="blue" mt={4} onClick={handleCheckout}>
                Tiến hành thanh toán
            </Button>
        </VStack>
        </Container>
    </Box>
    <Footer />
    </Box>
);
};

export default CheckoutPage;