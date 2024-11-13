
import {
    VStack,
    HStack,
    Text,
    Heading,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

const OrderInfo = ({ cart, selectedItems, totalPrice, shippingFee }) => {
    console.log("selectedItems trong OrderInfo.jsx:", selectedItems);
    useEffect(() => {
        console.log("selectedItems trong OrderInfo:", selectedItems);
    }, [selectedItems]);

    // Tạo một Set từ selectedItems để tối ưu hóa việc kiểm tra
    const selectedItemsSet = new Set(selectedItems);

    return (
        <VStack spacing={4} align="stretch">
            <Heading as="h2" size="lg" mb={2}>
                Thông tin đơn hàng
            </Heading>

            {cart.map(item => (
                <React.Fragment key={item.id}>
                    {selectedItemsSet.has(item.cart_item_id) && ( // Kiểm tra item có trong Set không
                        <HStack justifyContent="space-between">
                            <Text>{item.name} x {item.quantity}</Text>
                            <Text>{item.price}</Text>
                        </HStack>
                    )}
                </React.Fragment>
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