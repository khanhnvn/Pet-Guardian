import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    VStack,
} from '@chakra-ui/react';

const AddMedication = ({ petId, setPet, onRefresh }) => {
    const toast = useToast();
    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [dateAdministered, setDateAdministered] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('medication_name', medicationName);
        formData.append('dosage', dosage); // Không cần chuyển đổi sang số vì dosage có thể là chuỗi
        formData.append('date_administered', dateAdministered);

        try {
            const response = await fetch(`/api/pets/${petId}/medications`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet);

                onRefresh()
                setMedicationName('');
                setDosage('');
                setDateAdministered('');

                toast({
                    title: 'Thêm thuốc thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi thêm thuốc');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi thêm thuốc',
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
            <VStack spacing={4} align="start">
                <FormControl>
                    <FormLabel>Medication Name</FormLabel>
                    <Input
                        type="text"
                        value={medicationName}
                        onChange={(e) => setMedicationName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Dosage</FormLabel>
                    <Input
                        type="text"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Date Administered</FormLabel>
                    <Input
                        type="date"
                        value={dateAdministered}
                        onChange={(e) => setDateAdministered(e.target.value)}
                    />
                </FormControl>
                <Button type="submit" mt={4} colorScheme="blue">
                    Add Medication Record
                </Button>
            </VStack>
        </form>
    );
};

export default AddMedication;