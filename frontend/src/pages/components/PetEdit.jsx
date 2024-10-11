import { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    useToast,
    Select,
} from '@chakra-ui/react';

const PetEdit = ({ isOpen, onClose, pet, setPets, pets }) => {
    const toast = useToast();
    const [petName, setPetName] = useState(pet?.pet_name || '');
    const [petType, setPetType] = useState(pet?.pet_type || '');
    const [petAge, setPetAge] = useState(pet?.pet_age || '');
    const [petBirthday, setPetBirthday] = useState(pet?.pet_birthday || '');
    const [petGender, setPetGender] = useState(pet?.pet_gender || '');
    const [petColor, setPetColor] = useState(pet?.pet_color || '');

    useEffect(() => {
        // Cập nhật state khi pet thay đổi (khi modal được mở với pet khác)
        if (pet) {
            setPetName(pet?.pet_name || '');
            setPetType(pet?.pet_type || '');
            setPetAge(pet?.pet_age || '');
            setPetBirthday(pet?.pet_birthday || '');
            setPetGender(pet?.pet_gender || '');
            setPetColor(pet?.pet_color || '');
        }
        }, [pet]); // Dependency array là pet

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedPet = {
            id: pet.id,
            pet_name: petName,
            pet_type: petType,
            pet_age: petAge,
            pet_birthday: petBirthday,
            pet_gender: petGender,
            pet_color: petColor,
        };

        try {
            const response = await fetch(`/api/pets/${pet.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPet),
            });

            if (response.ok) {
                toast({
                    title: 'Cập nhật thú cưng thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Cập nhật danh sách thú cưng
                const updatedPets = pets.map((p) => (p.id === pet.id ? updatedPet : p));
                setPets(updatedPets);

                onClose(); // Đóng modal
            } else {
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi cập nhật thú cưng',
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
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Pet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="start">
                            <FormControl>
                                <FormLabel>Pet Name</FormLabel>
                                <Input
                                    type="text"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Pet Type</FormLabel>
                                <Select value={petType} onChange={(e) => setPetType(e.target.value)}> {/* Select cho petType */}
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
                                <Select value={petGender} onChange={(e) => setPetGender(e.target.value)}> {/* Select cho petGender */}
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Pet Color</FormLabel>
                                <Input type="text" value={petColor} onChange={(e) => setPetColor(e.target.value)} />
                            </FormControl>

                            <Button type="submit" mt={4} colorScheme="blue">
                                Save Changes
                            </Button>
                        </VStack>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PetEdit;