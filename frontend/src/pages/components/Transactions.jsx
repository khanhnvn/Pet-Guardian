import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

function Transactions({ transactions, onTransactionClick }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    const handleViewTransaction = (id) => {
        onTransactionClick(id);
    };

    return (
        <Table variant="striped" size="sm">
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>User ID</Th>
                    <Th>Tổng tiền</Th>
                    <Th>Ngày đặt hàng</Th>
                    <Th>Thao tác</Th>
                </Tr>
            </Thead>
            <Tbody>
                {transactions.map((transaction) => (
                    <Tr key={transaction.id}>
                        <Td>{transaction.id}</Td>
                        <Td>{transaction.user_id}</Td>
                        <Td>{parseInt(transaction.total_amount, 10).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Td>
                        <Td>{transaction.order_date}</Td>
                        <Td>
                            <Button colorScheme="blue" onClick={() => handleViewTransaction(transaction.id)}>Xem</Button>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}

export default Transactions;