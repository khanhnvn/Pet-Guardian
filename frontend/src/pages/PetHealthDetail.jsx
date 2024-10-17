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
    VStack,
    HStack,
    Image,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner, Flex, Grid,
} from '@chakra-ui/react';
import Navbar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import AddWeight from "./components/AddWeight.jsx";
import DeleteWeight from "./components/DeleteWeight.jsx";
import AddVaccine from "./components/AddVaccine.jsx";
import DeleteVaccine from "./components/DeleteVaccine.jsx";
import AddMedication from "./components/AddMedication.jsx";
import DeleteMedication from "./components/DeleteMedication.jsx";
import AddAllergy from './components/AddAllergy.jsx';
import DeleteAllergy from './components/DeleteAllergy.jsx';

const PetHealthDetail = () => {
    const { petId } = useParams();
    const [pet, setPet] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Thêm state loading
    const [activeTab, setActiveTab] = useState(0);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchPetDetails = async () => {
            setIsLoading(true); // Bật loading
            try {
                const response = await fetch(`/api/pets/${petId}`);
                const data = await response.json();
                setPet(data);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin thú cưng:', error);
            } finally {
                setIsLoading(false); // Tắt loading
            }
        };

        fetchPetDetails();
    }, [petId, refresh]);

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options); // Định dạng ngày tháng theo chuẩn Việt Nam
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    const handleRefresh = () => {
        setRefresh(prevRefresh => !prevRefresh);
    };

    return (
        <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />

            <Box flex={1}>
                <Container maxW="container.lg" p={10}>
                    {isLoading ? ( // Hiển thị loading indicator
                        <Spinner />
                    ) : pet ? (
                        <HStack spacing={50} alignItems="flex-start" >
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
                            <Box>
                                <Heading as="h1" size="xl" mb={10}>
                                    {pet.pet_name}'s Health Records
                                </Heading>

                                <Tabs index={activeTab} onChange={handleTabChange} variant="enclosed" width="100%"> {/* Controlled tabs */}
                                    <TabList mb="1em">
                                        <Grid templateColumns="repeat(4, 1fr)" gap={10}>
                                            <Tab >Weight</Tab>
                                            <Tab >Vaccines</Tab>
                                            <Tab >Medications</Tab>
                                            <Tab >Allergies</Tab>
                                        </Grid>
                                    </TabList>
                                    <TabPanels>
                                        {/* cân nặng */}
                                        <TabPanel>
                                            <HStack spacing={4}>
                                                <Box width="30%">
                                                    <AddWeight petId={petId} setPet={setPet} onRefresh={handleRefresh} />
                                                </Box>
                                                <Box flex="2">
                                                    <Heading as="h3" size="md" mb={2}>
                                                        Weight Records
                                                    </Heading>
                                                    <Table variant="simple">
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Weight (kg)</Th>
                                                                <Th>Date</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {pet?.weights?.map((weight) => (
                                                                <Tr key={weight.id}>
                                                                    <Td>{weight.weight}</Td>
                                                                    <Td>{formatDate(weight.date_recorded)}</Td>
                                                                    <Td>
                                                                        <DeleteWeight petId={petId} weightId={weight.id} setPet={setPet} />
                                                                    </Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>
                                                    </Table>
                                                </Box>
                                            </HStack>
                                        </TabPanel>
                                        {/* Vaccine */}
                                        <TabPanel>
                                            <HStack spacing={4}>
                                                <Box width="30%">
                                                    <AddVaccine petId={petId} setPet={setPet} onRefresh={handleRefresh} />
                                                </Box>
                                                <Box flex="2">
                                                    <Heading as="h3" size="md" mb={2}>
                                                        Vaccine Records
                                                    </Heading>
                                                    <Table variant="simple">
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Vaccine Name</Th>
                                                                <Th>Dosage</Th>
                                                                <Th>Date Administered</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {pet?.vaccines?.map((vaccine) => (
                                                                <Tr key={vaccine.id}>
                                                                    <Td>{vaccine.vaccine_name}</Td> {/* Hiển thị vaccine_name */}
                                                                    <Td>{vaccine.dosage}</Td> {/* Hiển thị dosage */}
                                                                    <Td>{formatDate(vaccine.date_administered)}</Td> {/* Hiển thị date_administered */}
                                                                    <Td>
                                                                        <DeleteVaccine petId={petId} vaccineId={vaccine.id} setPet={setPet} /> {/* Sử dụng DeleteVaccine */}
                                                                    </Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>
                                                    </Table>
                                                </Box>
                                            </HStack>
                                        </TabPanel>
                                        {/* Medication */}
                                        <TabPanel>
                                            <HStack spacing={4}>
                                                <Box width="30%">
                                                    <AddMedication petId={petId} setPet={setPet} onRefresh={handleRefresh} />
                                                </Box>
                                                <Box flex="2">
                                                    <Heading as="h3" size="md" mb={2}>
                                                        Medication Records
                                                    </Heading>
                                                    <Table variant="simple">
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Medication Name</Th>
                                                                <Th>Dosage</Th>
                                                                <Th>Date Administered</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {pet?.medications?.map((medication) => (
                                                                <Tr key={medication.id}>
                                                                    <Td>{medication.medication_name}</Td>
                                                                    <Td>{medication.dosage}</Td>
                                                                    <Td>{formatDate(medication.date_administered)}</Td>
                                                                    <Td>
                                                                        <DeleteMedication petId={petId} medicationId={medication.id} setPet={setPet} />
                                                                    </Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>
                                                    </Table>
                                                </Box>
                                            </HStack>
                                        </TabPanel>
                                        {/* allergy */}                                
                                        <TabPanel>
                                            <HStack spacing={4}>
                                                <Box width="30%">
                                                    <AddAllergy petId={petId} setPet={setPet} onRefresh={handleRefresh} /> {/* Truyền handleRefresh cho AddAllergy */}
                                                </Box>
                                                <Box flex="2">
                                                    <Heading as="h3" size="md" mb={2}>
                                                        Allergy Records
                                                    </Heading>
                                                    <Table variant="simple">
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Allergy</Th>
                                                                <Th>Cause</Th>
                                                                <Th>Symptoms</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {pet?.allergies?.map((allergy) => (
                                                                <Tr key={allergy.id}>
                                                                    <Td>{allergy.allergy}</Td>
                                                                    <Td>{allergy.cause}</Td>
                                                                    <Td>{allergy.symptoms}</Td>
                                                                    <Td>
                                                                        <DeleteAllergy petId={petId} allergyId={allergy.id} setPet={setPet} onRefresh={handleRefresh} /> {/* Truyền handleRefresh cho DeleteAllergy */}
                                                                    </Td>
                                                                </Tr>
                                                            ))}
                                                        </Tbody>
                                                    </Table>
                                                </Box>
                                            </HStack>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        </HStack>
                    ) : (
                        <Text>Không tìm thấy thú cưng.</Text>
                    )}
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default PetHealthDetail;