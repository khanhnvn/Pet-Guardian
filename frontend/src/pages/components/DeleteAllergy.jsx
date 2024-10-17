import { IconButton, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const DeleteAllergy = ({ petId, allergyId, setPet, onRefresh }) => {
    const toast = useToast();

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/pets/${petId}/allergies/${allergyId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet);

                onRefresh(); // Gọi onRefresh để re-render PetHealthDetail

                toast({
                    title: 'Xóa dị ứng thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi xóa dị ứng');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi xóa dị ứng',
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
        <IconButton
            aria-label="Delete Allergy"
            icon={<DeleteIcon />}
            onClick={handleDelete}
            colorScheme="red"
            size="sm"
        />
    );
};

export default DeleteAllergy;