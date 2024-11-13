//VetInfo.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import AddVeterinarianContact from "./components/AddVeterinarianContact"; // Component để thêm bác sĩ thú y
import ShowVeterinarianContact from "./components/ShowVeterinarianContact"; // Component để hiển thị danh sách bác sĩ thú y

const VetInfo = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/veterinarian_contacts');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách liên lạc bác sĩ thú y');
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Lỗi:', error);
        toast({
          title: 'Lỗi!',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex={1}>
        <Container maxW="container.lg" p={4}>
          <AddVeterinarianContact /> {/* Nút "Add New Veterinarian" */}
          {isLoading ? (
            <Spinner size="xl" />
          ) : (
            <ShowVeterinarianContact contacts={contacts} setContacts={setContacts} />
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default VetInfo;