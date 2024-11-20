import {
    Box,
    Heading,
    Text,
    VStack,
    Container,
    useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Filter from "./components/Filter";
import Summary from "./components/Summary";
import Transactions from "./components/Transactions";
import TransactionDetails from "./components/TransactionDetails";
import axios from 'axios';

const AdminHomePage = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filter, setFilter] = useState('today');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`/api/admin/transactions?filter=${filter}`);
                const sortedTransactions = response.data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
                setTransactions(sortedTransactions);
                setFilteredTransactions(sortedTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleTransactionClick = (id) => {
        setSelectedTransactionId(id);
        onOpen();
    };

    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    <VStack spacing={4} alignItems="flex-start">
                        <Heading as="h1" size="xl">
                            Welcome to your Admin Dashboard!
                        </Heading>
                        <Text>
                            Bạn có thể quản lý người dùng, sản phẩm, dịch vụ, giao dịch và thống kê tại đây.
                        </Text>
                        <Filter onFilterChange={handleFilterChange} />
                        <Summary transactions={filteredTransactions} />
                        <Transactions transactions={filteredTransactions} onTransactionClick={handleTransactionClick} />
                    </VStack>
                </Container>
            </Box>
            <Footer />
            {selectedTransactionId && (
                <TransactionDetails
                    isOpen={isOpen}
                    onClose={onClose}
                    transactionId={selectedTransactionId}
                />
            )}
        </Box>
    );
};

export default AdminHomePage;
