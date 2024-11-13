//Product.jsx
import { Box, Container, Heading } from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ProductGrid from "./components/ProductGrid";
import useProduct from "./useProduct";

const Product = ({ fetchCart, cart, setCart }) => {
    const { products, handleAddToCart } = useProduct();

    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    <Heading as="h1" size="xl" mb={4}>
                        Products
                    </Heading>
                    <ProductGrid products={products} onAddToCart={handleAddToCart} fetchCart={fetchCart} setCart={setCart} /> {/* Truyền hàm handleAddToCart cho ProductGrid */}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Product;