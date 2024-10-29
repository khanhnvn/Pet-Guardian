import { SimpleGrid } from '@chakra-ui/react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onAddToCart, fetchCart, setCart   }) => {
    return (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} fetchCart={fetchCart} setCart={setCart} />
            ))}
        </SimpleGrid>
    );
};

export default ProductGrid;