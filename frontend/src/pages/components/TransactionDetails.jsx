import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionDetails({ isOpen, onClose, transactionId }) {
const [transactionDetails, setTransactionDetails] = useState(null);

useEffect(() => {
    const fetchTransactionDetails = async () => {
    try {
        const response = await axios.get(`/api/transactions/${transactionId}`);
        setTransactionDetails(response.data);
    } catch (error) {
        console.error('Error fetching transaction details:', error);
    }
    };

    if (transactionId) {
    fetchTransactionDetails();
    }
}, [transactionId]);

return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
        <ModalHeader>Chi tiết đơn hàng #{transactionId}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        {transactionDetails ? (
            <Table>
            <Thead>
                <Tr>
                <Th>Sản phẩm</Th>
                <Th>Số lượng</Th>
                <Th>Giá</Th>
                </Tr>
            </Thead>
            <Tbody>
                {transactionDetails.products.map((product) => (
                <Tr key={product.id}>
                    <Td>{product.name}</Td>
                    <Td>{product.quantity}</Td>
                    <Td>{parseInt(product.price, 10).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Td>
                </Tr>
                ))}
            </Tbody>
            </Table>
        ) : (
            <p>Loading...</p>
        )}
        </ModalBody>
    </ModalContent>
    </Modal>
);
}

export default TransactionDetails;