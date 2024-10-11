import { IconButton, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const DeleteVaccine = ({ petId, vaccineId, setPet }) => {
    const toast = useToast();

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/pets/${petId}/vaccines/${vaccineId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet);

                toast({
                    title: 'Xóa vắc xin thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi xóa vắc xin');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi xóa vắc xin',
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
            aria-label="Delete Vaccine"
            icon={<DeleteIcon />}
            onClick={handleDelete}
            colorScheme="red"
            size="sm"
        />
    );
};

export default DeleteVaccine;