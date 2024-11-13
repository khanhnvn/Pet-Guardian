import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
  VStack,
  useToast,
  Container,
} from '@chakra-ui/react';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const MyService = () => {
  const toast = useToast();

  // Sử dụng 2 modal riêng biệt cho thêm và sửa dịch vụ
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure(); // Modal thêm dịch vụ
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure(); // Modal sửa dịch vụ

  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      const response = await fetch('/api/services/my'); // API endpoint để lấy dịch vụ của customer
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

  const handleAddService = () => {
    // Reset form và mở modal thêm dịch vụ
    setName('');
    setDescription('');
    setPrice('');
    onAddOpen();
  };

  const handleEditService = (service) => {
    // Điền thông tin dịch vụ vào form và mở modal sửa dịch vụ
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price);
    onEditOpen();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: description,
          price: price,
        }),
      });

      if (response.ok) {
        fetchMyServices();
        onAddClose();
        toast({
          title: 'Thêm dịch vụ thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Lỗi khi thêm dịch vụ');
        toast({
          title: 'Lỗi!',
          description: 'Lỗi khi thêm dịch vụ.',
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

  const handleUpdateService = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: description,
          price: price,
        }),
      });

      if (response.ok) {
        fetchMyServices();
        onEditClose();
        toast({
          title: 'Cập nhật dịch vụ thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Lỗi khi cập nhật dịch vụ');
        toast({
          title: 'Lỗi!',
          description: 'Lỗi khi cập nhật dịch vụ.',
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

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMyServices();
        toast({
          title: 'Xóa dịch vụ thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Lỗi khi xóa dịch vụ');
        toast({
          title: 'Lỗi!',
          description: 'Lỗi khi xóa dịch vụ.',
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
    <Box bg="#FFFCF8" minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex={1}>
        <Container maxW="container.lg" p={10}>
          <Heading as="h1" size="xl" mb={4}>
            My Services
          </Heading>
          <Button onClick={handleAddService} colorScheme="blue" mb={4}>
            {/* Nút mở modal thêm dịch vụ */}
            Add New Service
          </Button>
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
                <Text>Views: {service.views} - Sales: {service.sales}</Text> {/* Hiển thị lượt xem và lượt mua */}

                <HStack mt={4}>
                  <Button colorScheme="blue" onClick={() => handleEditService(service)}>
                    Edit
                  </Button>
                  <Button colorScheme="red" onClick={() => handleDeleteService(service.id)}>
                    Delete
                  </Button>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
          {/* Modal thêm dịch vụ */}
          <Modal isOpen={isAddOpen} onClose={onAddClose}>
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit}> 
                <ModalHeader>Add New Service</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <VStack spacing={4} align="start">
                    <FormControl>
                    <FormLabel>Service Name</FormLabel>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    </FormControl>
                </VStack>
                </ModalBody>
                <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onAddClose}>
                    Close
                </Button>
                <Button colorScheme="blue" type="submit"> 
                    Add Service
                </Button>
                </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Modal sửa dịch vụ */}
          <Modal isOpen={isEditOpen} onClose={onEditClose}>
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleUpdateService}> 
                <ModalHeader>Edit Service</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <VStack spacing={4} align="start">
                    <FormControl>
                    <FormLabel>Service Name</FormLabel>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    </FormControl>
                </VStack>
                </ModalBody>
                <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onEditClose}>
                    Close
                </Button>
                <Button colorScheme="blue" type="submit"> 
                    Save Changes
                </Button>
                </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default MyService;