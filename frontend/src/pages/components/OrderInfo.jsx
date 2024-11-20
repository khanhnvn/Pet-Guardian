
import {
    VStack,
    HStack,
    Text,
    Heading,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

const OrderInfo = ({ cart, selectedItems, totalPrice, shippingFee }) => {

    return (
        <VStack spacing={4} align="stretch">
            <Heading as="h2" size="lg" mb={2}>
                Thông tin đơn hàng
            </Heading>

            {cart.map(item => (
                <HStack justifyContent="space-between">
                    <Text>{item.name} x {item.quantity}</Text>
                    <Text>{item.price}</Text>
                </HStack> 
            ))}

            <HStack justifyContent="space-between">
                <Text fontWeight="bold">Tổng tiền sản phẩm:</Text>
                <Text fontWeight="bold">{totalPrice}</Text>
            </HStack>
            <HStack justifyContent="space-between">
                <Text fontWeight="bold">Phí giao hàng:</Text>
                <Text fontWeight="bold">{shippingFee}</Text>
            </HStack>
            <HStack justifyContent="space-between">
                <Text fontWeight="bold">Tổng thanh toán:</Text>
                <Text fontWeight="bold">{totalPrice + shippingFee}</Text>
            </HStack>
        </VStack>
    );
};

export default OrderInfo;