//ShipInfo.jsx
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    Heading,
} from '@chakra-ui/react';
import AddressForm from './AddressForm';

const ShipInfo = ({ recipientInfo, onRecipientInfoChange, shippingAddress, onShippingAddressChange }) => {
    return (
        <VStack spacing={4} align="stretch">
            <Heading as="h2" size="lg" mb={2}>
                Thông tin nhận hàng
            </Heading>
            <FormControl>
                <FormLabel>Họ tên:</FormLabel>
                <Input
                    type="text"
                    name="name"
                    value={recipientInfo.name}
                    onChange={onRecipientInfoChange}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Số điện thoại:</FormLabel>
                <Input
                    type="tel"
                    name="phone"
                    value={recipientInfo.phone}
                    onChange={onRecipientInfoChange}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Email:</FormLabel>
                <Input
                    type="email"
                    name="email"
                    value={recipientInfo.email}
                    onChange={onRecipientInfoChange}
                />
            </FormControl>
            <AddressForm 
                onAddressChange={onShippingAddressChange} 
                shippingAddress={shippingAddress}  
            />
        </VStack>
    );
};

export default ShipInfo;