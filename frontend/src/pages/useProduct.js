//useProduct.js
import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const useProduct = () => {
    const toast = useToast();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi lấy danh sách sản phẩm.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (productId, quantity) => {
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: productId, quantity: quantity }),
            });

            if (response.ok) {
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

    return { products, handleAddToCart };
};

export default useProduct;