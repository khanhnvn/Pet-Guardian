import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Heading,
    Image,
    Text,
    Button,
    Container,
    useToast,
    HStack,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const ProductDetail = ({ fetchCart, setCart }) => {
    const { productId } = useParams();
    const toast = useToast();
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1); // State lưu số lượng sản phẩm muốn mua


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin sản phẩm:', error);
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi lấy thông tin sản phẩm.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        fetchProduct();
    }, [productId]);

    const handleBuyProduct = (productId) => {
        // Chuyển hướng đến trang thanh toán hoặc hiển thị modal thanh toán
        // ... (Logic xử lý mua hàng, ví dụ: thêm sản phẩm vào giỏ hàng,
        // chuyển hướng đến trang thanh toán, tích hợp PayOS)
    };

    const handleAddToCart = async () => {
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: productId, quantity: quantity }),
            });

            if (response.ok) {
                const data = await response.json(); // Lấy dữ liệu giỏ hàng mới từ response
                console.log(data);
                setCart(data.cart); // Cập nhật giỏ hàng ở component cha (App)
                // Hiển thị thông báo thành công
                toast({
                    title: 'Đã thêm vào giỏ hàng!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                // Xử lý lỗi
                const errorData = await response.json();
                toast({
                    title: 'Lỗi!',
                    description: errorData.message || 'Lỗi khi thêm vào giỏ hàng.',
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

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1,
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1,
        );
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    <Heading as="h1" size="xl" mb={4}>
                        {product.name}
                    </Heading>
                    <HStack spacing={4}>
                        <Box w="40%">
                            <Image src={`/uploads/${product.images[currentImageIndex].image_url}`} alt={product.name} h="300px" objectFit="cover" mb={2} />
                            <HStack justifyContent="center" mt={2}>
                                <IconButton aria-label="Previous image" icon={<ArrowBackIcon />} onClick={handlePrevImage} />
                                <IconButton aria-label="Next image" icon={<ArrowForwardIcon />} onClick={handleNextImage} />
                            </HStack>
                        </Box>
                        <Box w="60%">
                            {/* ... (hiển thị mô tả, giá, lượt xem, lượt mua) */}
                            <Text mb={2}>{product.description}</Text>
                            <Text fontWeight="bold" mb={2}> Price: {product.price} </Text>
                            <Text mb={2}>Quantity: {product.quantity}</Text>
                            <Text>Views: {product.views} - Sales: {product.sales}</Text>
                            <HStack mt={4}>
                                {/* NumberInput để chọn số lượng */}
                                <NumberInput 
                                    value={quantity} 
                                    min={1} 
                                    max={product.quantity} // Giới hạn số lượng tối đa
                                    onChange={(valueString) => setQuantity(parseInt(valueString || '1', 10))}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <Button colorScheme="blue" onClick={handleAddToCart}>
                                    Add to Cart
                                </Button>
                            </HStack>
                        </Box>
                    </HStack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default ProductDetail;