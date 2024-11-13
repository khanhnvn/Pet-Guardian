//ProductCard.jsx
import { useState } from 'react';
import {
    Box,
    Heading,
    Image,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, fetchCart, setCart }) => {
    return (
        <Link to={`/product/${product.id}`}> {/* Liên kết đến trang chi tiết sản phẩm */}
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} cursor="pointer">
                {/* Hiển thị hình ảnh đầu tiên */}
                <Image src={`/uploads/${product.images && product.images.length > 0 ? product.images[0] : 'default_image.jpg'}`} 
                    alt={product.name} h="200px" objectFit="cover" mb={2} 
                />
                <Heading as="h3" size="md" mb={2}>
                    {product.name}
                </Heading>
                <Text fontWeight="bold" mb={2}>
                    Price: {product.price} 
                </Text>
                <Text>Quantity: {product.quantity}</Text>
                <Text>Views: {product.views} - Sales: {product.sales}</Text>
                <Text fontSize="sm" color="gray.500">
                    Đăng bởi: {product.customer_name}
                </Text>
            </Box>
        </Link>    
    );
};

export default ProductCard;