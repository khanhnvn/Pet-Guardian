//Allproduct.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Image,
    SimpleGrid,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    HStack,
    VStack,
    useToast,
    Container,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const AllProduct = () => {
    const toast = useToast();

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure(); // Modal sửa sản phẩm

    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]); // Sử dụng mảng để lưu trữ nhiều hình ảnh
    const [quantity, setQuantity] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('/api/products'); // API endpoint để lấy tất cả sản phẩm
            const data = await response.json();
            console.log(data);
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

    const handleImageChange = (event) => {
        setImages(Array.from(event.target.files)); // Chuyển đổi FileList sang mảng
    };



    const handleEditProduct = (product) => {
        // Điền thông tin sản phẩm vào form và mở modal sửa sản phẩm
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setImages(product.images); // Giả sử API trả về danh sách hình ảnh trong product.images
        setQuantity(product.quantity);
        onEditOpen();
    };


    const handleUpdateProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        images.forEach((image) => {
            formData.append('images[]', image);
        });
        formData.append('quantity', quantity);

        try {
            const response = await fetch(`/api/products/${editingProduct.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                fetchMyProducts();
                onEditClose(); // Đóng modal sửa sản phẩm
                toast({
                    title: 'Cập nhật sản phẩm thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi cập nhật sản phẩm');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi cập nhật sản phẩm.',
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

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchMyProducts();
                toast({
                    title: 'Xóa sản phẩm thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi xóa sản phẩm');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi xóa sản phẩm.',
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
                        All Products
                    </Heading>
                    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
                        {products.map((product) => (
                            <Box
                                key={product.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                p={4}
                            >
                                <Image src={`/uploads/${product.images[0]}`} alt={product.name} h="200px" objectFit="cover" mb={2} />

                                <Heading as="h3" size="md" mb={2}>
                                    {product.name}
                                </Heading>
                                <Text mb={2}>{product.description}</Text>
                                <Text fontWeight="bold" mb={2}> Price: {product.price}</Text>
                                <Text mb={2}>Quantity: {product.quantity}</Text>
                                <Text>Views: {product.views} - Sales: {product.sales}</Text> {/* Hiển thị lượt xem và lượt mua */}
                                <Text fontSize="sm" color="gray.500">
                                    Đăng bởi: {product.customer_name}
                                </Text>
                                <HStack mt={4}>
                                    <Button colorScheme="blue" onClick={() => handleEditProduct(product)}>
                                        Edit
                                    </Button>
                                    <Button colorScheme="red" onClick={() => handleDeleteProduct(product.id)}>
                                        Delete
                                    </Button>
                                </HStack>
                            </Box>
                        ))}
                    </SimpleGrid>
                    {/* Modal sửa sản phẩm */}
                    <Modal isOpen={isEditOpen} onClose={onEditClose}>
                        <ModalOverlay />
                        <ModalContent as="form" onSubmit={handleUpdateProduct}> {/* Chuyển form ra ngoài ModalContent */}
                            <ModalHeader>Edit Product</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <VStack spacing={4} align="start">
                                    <FormControl>
                                        <FormLabel>Product Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Description</FormLabel>
                                        <Textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Price</FormLabel>
                                        <Input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Images</FormLabel>
                                        <Input type="file" multiple onChange={handleImageChange} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Quantity</FormLabel>
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                    </FormControl>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="ghost" mr={3} onClick={onEditClose}>
                                    Close
                                </Button>
                                <Button colorScheme="blue" type="submit"> {/* Nút submit trong ModalFooter */}
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default AllProduct;