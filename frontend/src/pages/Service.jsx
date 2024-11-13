import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Container,
  useToast,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const Service = () => {
  const toast = useToast();
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services'); // API endpoint để lấy tất cả dịch vụ
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', error);
      toast({
        title: 'Lỗi!',
        description: 'Lỗi khi lấy danh sách dịch vụ.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex={1}>
        <Container maxW="container.lg" p={10}>
          <Heading as="h1" size="xl" mb={4}>
            Services
          </Heading>
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
            {services.map((service) => (
              <Box
                key={service.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
              >
                {/* Hiển thị thông tin dịch vụ */}
                <Heading as="h3" size="md" mb={2}>
                  {service.name}
                </Heading>
                <Text mb={2}>{service.description}</Text>
                <Text fontWeight="bold" mb={2}> Price: {service.price}</Text>
                {/* Hiển thị thêm thông tin nếu cần */}
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Service;