import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    VStack,
} from '@chakra-ui/react';

const AddAllergy = ({ petId, setPet, onRefresh }) => {
    const toast = useToast();
    const [allergy, setAllergy] = useState('');
    const [cause, setCause] = useState('');
    const [symptoms, setSymptoms] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('allergy', allergy);
        formData.append('cause', cause);
        formData.append('symptoms', symptoms);

        try {
            const response = await fetch(`/api/pets/${petId}/allergies`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet);

                setAllergy('');
                setCause('');
                setSymptoms('');

                onRefresh(); // Gọi onRefresh để re-render PetHealthDetail

                toast({
                    title: 'Thêm dị ứng thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Lỗi khi thêm dị ứng');
                toast({
                    title: 'Lỗi!',
                    description: 'Lỗi khi thêm dị ứng',
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
                    <FormLabel>Allergy</FormLabel>
                    <Input
                        type="text"
                        value={allergy}
                        onChange={(e) => setAllergy(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Cause</FormLabel>
                    <Input
                        type="text"
                        value={cause}
                        onChange={(e) => setCause(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Symptoms</FormLabel>
                    <Input
                        type="text"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                </FormControl>
                <Button type="submit" mt={4} colorScheme="blue">
                    Add Allergy Record
                </Button>
            </VStack>
        </form>
    );
};

export default AddAllergy;