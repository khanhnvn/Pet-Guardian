import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react';

const AddWeight = ({ petId, setPet }) => {
    const toast = useToast();
    const [weight, setWeight] = useState('');
    const [dateRecorded, setDateRecorded] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('weight', weight);
        formData.append('date_recorded', dateRecorded);

        try {
            const response = await fetch(`/api/pets/${petId}/weight`, {
                method: 'POST',
                body: formData, // Gửi FormData
            });

            if (response.ok) {
                // Cập nhật danh sách cân nặng sau khi thêm thành công
                const updatedPet = await response.json();
                setPet(updatedPet);

                // Reset form
                setWeight('');
                setDateRecorded('');

                toast({
                    title: 'Thêm cân nặng thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                // Xử lý lỗi
                console.error('Lỗi khi thêm cân nặng');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi thêm cân nặng',
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
        <form onSubmit={handleSubmit}>
            <FormControl>
                <FormLabel>Weight (kg)</FormLabel>
                <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Date Recorded</FormLabel>
                <Input
                    type="date"
                    value={dateRecorded}
                    onChange={(e) => setDateRecorded(e.target.value)}
                />
            </FormControl>
            <Button type="submit" mt={4} colorScheme="blue">
                Add Weight Record
            </Button>
        </form>
    );
};

export default AddWeight;