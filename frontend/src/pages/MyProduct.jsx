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
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const MyProduct = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const response = await fetch('/api/products/my'); // API endpoint để lấy sản phẩm của customer
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

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        if (image) {
            formData.append('image', image);
        }
        formData.append('quantity', quantity);

        try {
            const response = await fetch('/api/products', { // Sử dụng cùng endpoint với Product.jsx
                method: isEditing ? 'PUT' : 'POST',
                body: formData,
            });

            if (response.ok) {
                fetchMyProducts(); // Cập nhật lại danh sách sản phẩm
                onClose();
                toast({
                    title: isEditing ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi thêm/cập nhật sản phẩm');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi thêm/cập nhật sản phẩm.',
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

    const handleEditProduct = (product) => {
        setIsEditing(true);
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setQuantity(product.quantity);
        onOpen();
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchMyProducts(); // Cập nhật lại danh sách sản phẩm
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
                        My Products
                    </Heading>
                    <Button onClick={onOpen} colorScheme="blue" mb={4}>
                        Add New Product
                    </Button>
                    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
                        {products.map((product) => (
                            <Box
                                key={product.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                pp={4}
                                >
                                    <Image src={`/uploads/${product.image}`} alt={product.name} h="200px" objectFit="cover" mb={2} />
                                    <Heading as="h3" size="md" mb={2}>
                                        {product.name}
                                    </Heading>
                                    <Text mb={2}>{product.description}</Text>
                                    <Text fontWeight="bold" mb={2}>Price: ${product.price}</Text>
                                    <Text>Quantity: {product.quantity}</Text>
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
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>{isEditing ? 'Edit Product' : 'Add New Product'}</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <form onSubmit={handleSubmit}>
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
                                                <FormLabel>Image</FormLabel>
                                                <Input type="file" onChange={handleImageChange} />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Quantity</FormLabel>
                                                <Input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                />
                                            </FormControl>
                                            <Button type="submit" mt={4} colorScheme="blue">
                                                {isEditing ? 'Save Changes' : 'Add Product'}
                                            </Button>
                                        </VStack>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="ghost" mr={3} onClick={onClose}>
                                        Close
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