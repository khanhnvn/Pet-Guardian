import { IconButton, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const DeleteMedication = ({ petId, medicationId, setPet }) => {
    const toast = useToast();

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/pets/${petId}/medications/${medicationId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet);

                toast({
                    title: 'Xóa thuốc thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi xóa thuốc');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi xóa thuốc',
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
            aria-label="Delete Medication"
            icon={<DeleteIcon />}
            onClick={handleDelete}
            colorScheme="red"
            size="sm"
        />
    );
};

export default DeleteMedication;