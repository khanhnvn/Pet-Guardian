//AddressForm.jsx
import React, { useState, useEffect } from 'react';
import {
    FormControl,
    FormLabel,
    Select,
    VStack,
    Heading,
    Input,
} from '@chakra-ui/react';

const AddressForm = ({ onAddressChange, shippingAddress }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    useEffect(() => {
        const fetchAddressData = async () => {
            try {
                const response = await fetch('/tree.json');
                if (!response.ok) {
                    throw new Error('Lỗi khi lấy dữ liệu địa chỉ');
                  }
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu địa chỉ:', error);
            }
        };

        fetchAddressData();
    }, []);

    const handleProvinceChange = (event) => {
        const provinceCode = event.target.value;
        setSelectedProvince(provinceCode);
        setDistricts(provinces[provinceCode]['quan-huyen']);
        setSelectedDistrict('');
        setWards([]);
        onAddressChange({
            province: provinceCode,
            district: '',
            ward: '',
            street: '',
        });
    };

    const handleDistrictChange = (event) => {
        const districtCode = event.target.value;
        setSelectedDistrict(districtCode);
        setWards(districts[districtCode]['xa-phuong']);
        setSelectedWard('');
        onAddressChange({
            ...shippingAddress,
            district: districtCode,
            ward: '',
            street: '',
        });
    };

    const handleWardChange = (event) => {
        const wardCode = event.target.value;
        setSelectedWard(wardCode);
        onAddressChange({
            ...shippingAddress,
            ward: wardCode,
            street: '',
        });
    };

    return (
        <VStack spacing={4} align="stretch">
            <Heading as="h3" size="md" mb={2}>
                Địa chỉ nhận hàng
            </Heading>
            <FormControl>
                <FormLabel htmlFor="province">Tỉnh/Thành phố:</FormLabel>
                <Select id="province" value={selectedProvince} onChange={handleProvinceChange}>
                    <option value="">Chọn tỉnh/thành phố</option>
                    {Object.entries(provinces ?? {}).map(([code, province]) => (
                        <option key={code} value={code}>
                            {province.name}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="district">Quận/Huyện:</FormLabel>
                <Select id="district" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince}>
                    <option value="">Chọn quận/huyện</option>
                    {Object.entries(districts ?? {}).map(([code, district]) => (
                        <option key={code} value={code}>
                            {district.name}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="ward">Xã/Phường:</FormLabel>
                <Select id="ward" value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict}>
                    <option value="">Chọn xã/phường</option>
                    {Object.entries(wards ?? {}).map(([code, ward]) => (
                        <option key={code} value={code}>
                            {ward.name}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="street">Số nhà, tên đường:</FormLabel>
                <Input
                    type="text"
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => onAddressChange({ ...shippingAddress, street: e.target.value })}
                />
            </FormControl>
        </VStack>
    );
};

export default AddressForm;