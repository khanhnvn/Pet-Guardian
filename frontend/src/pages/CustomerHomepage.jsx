// CustomerHomePage.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const CustomerHomePage = () => {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch('/api/customers/revenue');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy doanh số');
        }
        const data = await response.json();
        setRevenue(data.total_revenue);
      } catch (error) {
        console.error('Lỗi:', error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
      }
    };

    fetchRevenue();
  }, []);

  return (
    <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex={1}>
        <Container maxW="container.lg" p={10}>
          <VStack spacing={4} alignItems="flex-start">
            <Heading as="h1" size="xl">
              Tổng doanh thu
            </Heading>
            <Text fontSize="2xl">
              {revenue} VND
            </Text>
          </VStack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default CustomerHomePage;