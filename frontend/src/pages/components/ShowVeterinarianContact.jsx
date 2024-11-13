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
  useDisclosure,
  VStack,
  Flex,
  HStack,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import VeterinarianContactEdit from "./VeterinarianContactEdit"; // Component để chỉnh sửa liên lạc bác sĩ thú y

const ShowVeterinarianContact = ({ contacts, setContacts }) => {
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedContact, setSelectedContact] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const toast = useToast();

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setEditingContact({ ...contact });
    onEditOpen();
  };

  const handleDeleteClick = async (contactId) => {
    try {
      const response = await fetch(`/api/veterinarian_contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Cập nhật danh sách liên lạc sau khi xóa
        const updatedContacts = contacts.filter((contact) => contact.id !== contactId);
        setContacts(updatedContacts);
        toast({
          title: 'Xóa liên lạc thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Lỗi khi xóa liên lạc');
        toast({
          title: 'Lỗi!',
          description: 'Lỗi khi xóa liên lạc',
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
    <Box>
      <Heading as="h1" size="xl" mb={4}>
        Danh sách liên lạc bác sĩ thú y
      </Heading>

      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {contacts.map((contact) => (
          <Box
            key={contact.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
          >
            <VStack align="start" spacing={2}> {/* Thêm spacing cho dễ nhìn */}
              <Text fontWeight="bold">Tên liên lạc: {contact.contact_name}</Text>
              <Text>Giới tính: {contact.contact_gender}</Text>
              <Text>Ngôn ngữ: {contact.contact_language}</Text>
              <Text>Số điện thoại: {contact.contact_phone}</Text>
              <Text>Địa chỉ: {contact.vet_address}</Text>
              <Text>Email: {contact.vet_email}</Text>
              <Text>Chuyên khoa: {contact.vet_speciality}</Text>
              <Text>Phòng khám: {contact.vet_clinic}</Text>
            </VStack>
            <HStack mt={4} justifyContent="end">
              <IconButton
                aria-label="Edit Contact"
                icon={<EditIcon />}
                onClick={() => handleEditClick(contact)}
              />
              <IconButton
                aria-label="Delete Contact"
                icon={<DeleteIcon />}
                onClick={() => handleDeleteClick(contact.id)}
                colorScheme="red"
              />
            </HStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Modal chỉnh sửa */}
      <VeterinarianContactEdit
        isOpen={isEditOpen}
        onClose={onEditClose}
        contact={editingContact}
        setContacts={setContacts}
        contacts={contacts}
      />
    </Box>
  );
};

export default ShowVeterinarianContact;