// AddPet.jsx
import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Button,
    useToast,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    Select,
} from '@chakra-ui/react';

const AddPet = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState('dog');
    const [petAge, setPetAge] = useState('');
    const [petBirthday, setPetBirthday] = useState('');
    const [petGender, setPetGender] = useState('male');
    const [petColor, setPetColor] = useState('');
    const [petImage, setPetImage] = useState(null);

    const handleImageChange = (event) => {
        setPetImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('pet_name', petName);
        formData.append('pet_type', petType);
        formData.append('pet_age', petAge);
        formData.append('pet_birthday', petBirthday);
        formData.append('pet_gender', petGender);
        formData.append('pet_color', petColor);
        formData.append('pet_image', petImage);

        try {
            const response = await fetch('/api/pets', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast({
                    title: 'Thêm thú cưng thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Reset form và đóng modal
                setPetName('');
                setPetType('dog');
                setPetAge('');
                setPetBirthday('');
                setPetGender('male');
                setPetColor('');
                setPetImage(null);
                onClose();
            } else {
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi thêm thú cưng',
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
        <>
            <Button onClick={onOpen} colorScheme="blue">
                Add New Pet
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Pet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="start">
                                <FormControl>
                                    <FormLabel>Pet Name</FormLabel>
                                    <Input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Pet Type</FormLabel>
                                    <Select value={petType} onChange={(e) => setPetType(e.target.value)}>
                                        <option value="dog">Dog</option>
                                        <option value="cat">Cat</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Pet Age</FormLabel>
                                    <Input type="number" value={petAge} onChange={(e) => setPetAge(e.target.value)} />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Pet Birthday</FormLabel>
                                    <Input type="date" value={petBirthday} onChange={(e) => setPetBirthday(e.target.value)} />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Pet Gender</FormLabel>
                                    <Select value={petGender} onChange={(e) => setPetGender(e.target.value)}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Pet Color</FormLabel>
                                    <Input type="text" value={petColor} onChange={(e) => setPetColor(e.target.value)} />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Pet Image</FormLabel>
                                    <Input type="file" onChange={handleImageChange} />
                                    <FormHelperText>Chọn ảnh cho thú cưng của bạn</FormHelperText>
                                </FormControl>

                                <Button type="submit" mt={4} colorScheme="blue">
                                    Add Pet
                                </Button>
                            </VStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddPet;