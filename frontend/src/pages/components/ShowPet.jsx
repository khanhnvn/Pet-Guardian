// ShowPet.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Image,
    SimpleGrid,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    VStack, Flex, HStack, IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import PetEdit from "./PetEdit.jsx";
import { useNavigate } from 'react-router-dom';

const ShowPet = ({ pets, setPets }) => {
    const navigate = useNavigate();
    const {
        isOpen: isInfoOpen,
        onOpen: onInfoOpen,
        onClose: onInfoClose,
    } = useDisclosure();
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure();

    const [selectedPet, setSelectedPet] = useState(null);
    const [editingPet, setEditingPet] = useState(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch('/api/pets');
                const data = await response.json();
                setPets(data);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin thú cưng:', error);
            }
        };

        fetchPets();
    }, []);

    const handlePetClick = (pet) => {
        navigate(`/pet/${pet.id}/health`); // Chuyển hướng đến trang chi tiết sức khỏe
    };

    const handleEditClick = (pet) => {
        setSelectedPet(pet);
        setEditingPet({ ...pet });
        onEditOpen();
    };

    const handleDeleteClick = async (petId) => {
        try {
            const response = await fetch(`/api/pets/${petId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Cập nhật danh sách thú cưng sau khi xóa
                const updatedPets = pets.filter((pet) => pet.id !== petId);
                setPets(updatedPets);
            } else {
                // Xử lý lỗi
                console.error('Lỗi khi xóa thú cưng');
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    return (
        <Box>
            <Heading as="h1" size="xl" mb={4}>
                My Pets
            </Heading>

            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
                {pets?.map((pet) => (
                    <Box
                        key={pet.id}
                        borderWidth="1px" borderRadius="lg"
                        overflow="hidden"
                        cursor="pointer"
                        display="flex" // Sử dụng Flexbox
                        flexDirection="column" // Sắp xếp element theo chiều dọc
                    >
                        <Image src={`/uploads/${pet.pet_image}`} alt={pet.pet_name}
                               onClick={() => handlePetClick(pet)}
                               objectFit="cover" // Đảm bảo ảnh bao phủ toàn bộ container
                               flex={1} // Cho phép Image co giãn để chiếm không gian
                        />
                        <Flex p="6" alignItems="center" justifyContent="space-between"> {/* Sử dụng Flexbox */}
                            <Heading as="h3" size="md" mb={2}>
                                {pet.pet_name}
                            </Heading>
                            <HStack> {/* Nút Edit và Delete */}
                                <IconButton
                                    aria-label="Edit Pet"
                                    icon={<EditIcon />}
                                    onClick={() => handleEditClick(pet)} // Click vào nút Edit để chỉnh sửa
                                />
                                <IconButton
                                    aria-label="Delete Pet"
                                    icon={<DeleteIcon />}
                                    onClick={() => handleDeleteClick(pet.id)} // Click vào nút Delete để xóa
                                />
                            </HStack>
                        </Flex>
                    </Box>
                ))}
            </SimpleGrid>

            {/* Modal */}

            <Modal isOpen={isInfoOpen} onClose={onInfoClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedPet?.pet_name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack alignItems="start">
                            {selectedPet && (
                                <>
                                    <Text>
                                        **Type:** {selectedPet.pet_type}
                                    </Text>
                                    <Text>
                                        **Age:** {selectedPet.pet_age}
                                    </Text>
                                    <Text>
                                        **Birthday:** {selectedPet.pet_birthday}
                                    </Text>
                                    <Text>
                                        **Gender:** {selectedPet.pet_gender}
                                    </Text>
                                    <Text>
                                        **Color:** {selectedPet.pet_color}
                                    </Text>
                                    {/* Hiển thị thêm thông tin nếu cần */}
                                </>
                            )}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal chỉnh sửa */}
            <PetEdit
                isOpen={isEditOpen}
                onClose={onEditClose}
                pet={editingPet}
                setPets={setPets}
                pets={pets}
            /> {/* Modal chỉnh sửa */}
        </Box>
    );
};

export default ShowPet;