//MyProduct.jsx
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

const MyProduct = () => {
    const toast = useToast();

    // Sử dụng 2 modal riêng biệt cho thêm và sửa sản phẩm
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure(); // Modal thêm sản phẩm
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure(); // Modal sửa sản phẩm

    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]); // Sử dụng mảng để lưu trữ nhiều hình ảnh
    const [quantity, setQuantity] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const response = await fetch('/api/products/my'); // API endpoint để lấy sản phẩm của customer
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

    const handleAddProduct = () => {
        // Reset form và mở modal thêm sản phẩm
        setName('');
        setDescription('');
        setPrice('');
        setImages([]);
        setQuantity('');
        onAddOpen();
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        images.forEach((image) => {
            formData.append('images[]', image); // Gửi nhiều ảnh với key "images[]"
        });
        formData.append('quantity', quantity);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                fetchMyProducts();
                onAddClose(); // Đóng modal thêm sản phẩm
                toast({
                    title: 'Thêm sản phẩm thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi thêm sản phẩm');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi thêm sản phẩm.',
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
                    description: errorData.message || 'Lỗi khi xóa sản phẩm.',
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
                        My Products
                    </Heading>
                    <Button onClick={handleAddProduct} colorScheme="blue" mb={4}> {/* Nút mở modal thêm sản phẩm */}
                        Add New Product
                    </Button>
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
                                <Text>Views: {product.views} - Sales: {product.sales}</Text> {/* Hiển thịlượt xem và lượt mua */}
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
                    {/* Modal thêm sản phẩm */}
                    <Modal isOpen={isAddOpen} onClose={onAddClose}>
                        <ModalOverlay />
                        <ModalContent as="form" onSubmit={handleSubmit}> {/* Chuyển form ra ngoài ModalContent */}
                            <ModalHeader>Add New Product</ModalHeader>
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
                                <Button variant="ghost" mr={3} onClick={onAddClose}>
                                    Close
                                </Button>
                                <Button colorScheme="blue" type="submit"> {/* Nút submit trong ModalFooter */}
                                    Add Product
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
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

export default MyProduct;