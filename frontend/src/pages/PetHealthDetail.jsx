// PetHealthDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Text,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    VStack, HStack, Image
} from '@chakra-ui/react';
import Navbar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import AddWeight from "./components/AddWeight.jsx";
import DeleteWeight from "./components/DeleteWeight.jsx";

const PetHealthDetail = () => {
    const { petId } = useParams();
    const [pet, setPet] = useState(null);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const response = await fetch(`/api/pets/${petId}`);
                const data = await response.json();
                setPet(data);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin thú cưng:', error);
            }
        };

        fetchPetDetails();
    }, [petId]);

    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />

            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    {pet ? (
                        <HStack spacing={50} alignItems="flex-start"> {/* Sử dụng HStack để sắp xếp thông tin và sức khỏe */}
                            {/* Thông tin thú cưng */}
                            <Box>
                                <Image src={`/uploads/${pet.pet_image}`} alt={pet.pet_name} boxSize="200px" objectFit="cover" mb={10} />
                                <VStack alignItems="start">
                                    <Text>
                                        **Type:** {pet.pet_type}
                                    </Text>
                                    <Text>
                                        **Age:** {pet.pet_age}
                                    </Text>
                                    <Text>
                                        **Birthday:** {pet.pet_birthday}
                                    </Text>
                                    <Text>
                                        **Gender:** {pet.pet_gender}
                                    </Text>
                                    <Text>
                                        **Color:** {pet.pet_color}
                                    </Text>
                                    {/* Hiển thị thêm thông tin nếu cần */}
                                </VStack>
                            </Box>

                            {/* Thông tin sức khỏe */}
                            <Box >
                                <Heading as="h1" size="xl" mb={10}>
                                    {pet.pet_name}'s Health Records
                                </Heading>

                                <Tabs isFitted variant="enclosed" width="200%">
                                    <TabList mb="1em">
                                        <Tab>Weight</Tab>
                                        <Tab>Vaccines</Tab>
                                        <Tab>Medications</Tab>
                                        <Tab>Allergies</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel>
                                            <AddWeight petId={petId} setPet={setPet} /> {/* Thêm thông tin cân nặng */}
                                            {/* Hiển thị thông tin cân nặng */}
                                            <VStack align="start" mt={4}>
                                                {pet.weights.map((weight) => (
                                                    <HStack key={weight.id} alignItems="start"> {/* Sử dụng HStack để căn chỉnh Text và Button */}
                                                        <Text>
                                                            {weight.date_recorded}: {weight.weight} kg
                                                        </Text>
                                                        <DeleteWeight petId={petId} weightId={weight.id} setPet={setPet} /> {/* Nút Delete */}
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </TabPanel>
                                        <TabPanel>
                                            {/* Hiển thị thông tin vắc xin */}
                                            <VStack align="start">
                                                {pet.vaccines.map((vaccine) => (
                                                    <Text key={vaccine.id}>
                                                        {vaccine.vaccine_name} - {vaccine.dosage} - {vaccine.date_administered}
                                                    </Text>
                                                ))}
                                            </VStack>
                                        </TabPanel>
                                        <TabPanel>
                                            {/* Hiển thị thông tin thuốc */}
                                            <VStack align="start">
                                                {pet.medications.map((medication) => (
                                                    <Text key={medication.id}>
                                                        {medication.medication_name} - {medication.dosage} - {medication.date_administered}
                                                    </Text>
                                                ))}
                                            </VStack>
                                        </TabPanel>
                                        <TabPanel>
                                            {/* Hiển thị thông tin dị ứng */}
                                            <VStack align="start">
                                                {pet.allergies.map((allergy) => (
                                                    <Text key={allergy.id}>
                                                        {allergy.allergy} - {allergy.cause} - {allergy.symptoms}
                                                    </Text>
                                                ))}
                                            </VStack>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        </HStack>

                    ) : (
                        <Text>Loading...</Text>
                    )}
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default PetHealthDetail;