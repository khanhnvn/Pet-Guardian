import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    VStack,
} from '@chakra-ui/react';

const AddVaccine = ({ petId, setPet, onRefresh }) => {
    const toast = useToast();
    const [vaccineName, setVaccineName] = useState('');
    const [dosage, setDosage] = useState('');
    const [dateAdministered, setDateAdministered] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('vaccine_name', vaccineName);
        formData.append('dosage', parseInt(dosage));
        formData.append('date_administered', dateAdministered);

        try {
            const response = await fetch(`/api/pets/${petId}/vaccines`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet);

                onRefresh()
                setVaccineName('');
                setDosage('');
                setDateAdministered('');

                toast({
                    title: 'Thêm vắc xin thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi thêm vắc xin');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi thêm vắc xin',
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
                    <FormLabel>Vaccine Name</FormLabel>
                    <Input
                        type="text"
                        value={vaccineName}
                        onChange={(e) => setVaccineName(e.target.value)}
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
                    Add Vaccine Record
                </Button>
            </VStack>
        </form>
    );
};

export default AddVaccine;