import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Image,
    Button,
    Container,
    useToast,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Spacer,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const Cart = () => {
    const toast = useToast();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

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
    
    const handleRemoveFromCart = async (cartItemId) => {
        try {
            const response = await fetch(`/api/cart/remove/${cartItemId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCart();
                toast({
                    title: 'Xóa sản phẩm khỏi giỏ hàng thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                // Xử lý lỗi
                const errorData = await response.json();
                toast({
                    title: 'Lỗi!',
                    description: errorData.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng.',
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

    const handleQuantityChange = async (cartItemId, newQuantity) => { // Sửa productId thành cartItemId
        try {
            // Gửi request đến API để cập nhật số lượng
            const response = await fetch('/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart_item_id: cartItemId, quantity: newQuantity }), // Sửa product_id thành cart_item_id
            });

            if (response.ok) {
                fetchCart(); // Cập nhật lại giỏ hàng sau khi thay đổi số lượng
            } else {
                // Xử lý lỗi
                const errorData = await response.json();
                toast({
                    title: 'Lỗi!',
                    description: errorData.message || 'Lỗi khi cập nhật số lượng sản phẩm.',
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

    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/cart/checkout', {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Checkout data:", data);
                window.open(data.checkoutUrl);
            } else {
                // Xử lý lỗi thanh toán
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

    // Tính toán tổng tiền
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    <Heading as="h1" size="xl" mb={4}>
                        Giỏ hàng
                    </Heading>
                    {cart.length === 0 ? (
                        <Text>Giỏ hàng trống</Text>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            {cart.map((item) => (
                                <Box key={item.id} borderWidth="1px" borderRadius="lg" p={4}>
                                    <HStack>
                                        {/* Hiển thị hình ảnh */}
                                        {item.images && item.images.length > 0 ? (
                                            <Image src={`/uploads/${item.images[0]}`} alt={item.name} boxSize="100px" objectFit="cover" />
                                        ) : (
                                            <Image src={`/uploads/default_image.jpg`} alt="Default Image" boxSize="100px" objectFit="cover" />
                                        )}
                                        <VStack align="start">
                                            <Heading as="h3" size="md">
                                                {item.name}
                                            </Heading>
                                            <Text>Giá: {item.price}</Text>
                                            {/* NumberInput để thay đổi số lượng */}
                                            <NumberInput 
                                                value={item.quantity} 
                                                min={1} 
                                                max={item.quantity} 
                                                onChange={(valueString) => handleQuantityChange(item.cart_item_id, parseInt(valueString || '1', 10))} // Thay đổi product.id thành item.cart_item_id
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </VStack>
                                        <Spacer />
                                        <Button colorScheme="red" size="sm" onClick={() => handleRemoveFromCart(item.cart_item_id)}> {/* Thay đổi product.id thành item.cart_item_id */}
                                            Xóa
                                        </Button>
                                    </HStack>
                                </Box>
                            ))}
                            <Box>
                                <Text fontSize="xl" fontWeight="bold">Tổng tiền: ${totalPrice}</Text>
                                <Button colorScheme="blue" mt={4} onClick={handleCheckout}>
                                    Tiến hành thanh toán
                                </Button>
                            </Box>
                        </VStack>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Cart;