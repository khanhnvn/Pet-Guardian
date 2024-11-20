//Cart.jsx
import { useState, useEffect, useMemo } from 'react';
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
    Checkbox,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const toast = useToast();
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

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

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        try {
            const response = await fetch('/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart_item_id: cartItemId, quantity: newQuantity }),
            });

            if (response.ok) {
                fetchCart();
            } else {
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
      
    // Tính toán tổng tiền của các sản phẩm được chọn
    const totalPrice = useMemo(() => {
        return cart.reduce((total, item) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price;
                return total + price * item.quantity;
        }, 0);
    }, [cart]);

    const handleCheckout = () => {
        navigate(`/checkout`); 
        
    };


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
                                            <NumberInput 
                                                value={item.quantity} 
                                                min={1} 
                                                max={item.quantity} 
                                                onChange={(valueString) => handleQuantityChange(item.cart_item_id, parseInt(valueString || '1', 10))}
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </VStack>
                                        <Spacer />
                                        <Button colorScheme="red" size="sm" onClick={() => handleRemoveFromCart(item.cart_item_id)}>
                                            Xóa
                                        </Button>
                                    </HStack>
                                </Box>
                            ))}
                            <Box>
                                <Text fontSize="xl" fontWeight="bold">Tổng tiền: {totalPrice}</Text> {/* Hiển thị tổng tiền */}
                                
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