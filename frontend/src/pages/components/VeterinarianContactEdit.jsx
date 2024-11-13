import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  Select,
} from '@chakra-ui/react';

const VeterinarianContactEdit = ({ isOpen, onClose, contact, setContacts, contacts }) => {
  const toast = useToast();
  const [contactName, setContactName] = useState(contact?.contact_name || '');
  const [contactGender, setContactGender] = useState(contact?.contact_gender || '');
  const [contactLanguage, setContactLanguage] = useState(contact?.contact_language || '');
  const [contactPhone, setContactPhone] = useState(contact?.contact_phone || '');
  const [vetAddress, setVetAddress] = useState(contact?.vet_address || '');
  const [vetEmail, setVetEmail] = useState(contact?.vet_email || '');
  const [vetSpeciality, setVetSpeciality] = useState(contact?.vet_speciality || '');
  const [vetClinic, setVetClinic] = useState(contact?.vet_clinic || '');

  useEffect(() => {
    // Cập nhật state khi props contact thay đổi
    if (contact) {
      setContactName(contact.contact_name);
      setContactGender(contact.contact_gender);
      setContactLanguage(contact.contact_language);
      setContactPhone(contact.contact_phone);
      setVetAddress(contact.vet_address);
      setVetEmail(contact.vet_email);
      setVetSpeciality(contact.vet_speciality);
      setVetClinic(contact.vet_clinic);
    }
  }, [contact]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/veterinarian_contacts/${contact.id}`, {
        method: 'PUT', // Hoặc PATCH, tùy thuộc vào API của bạn
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact_name: contactName,
          contact_gender: contactGender,
          contact_language: contactLanguage,
          contact_phone: contactPhone,
          vet_address: vetAddress,
          vet_email: vetEmail,
          vet_speciality: vetSpeciality,
          vet_clinic: vetClinic,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Cập nhật liên lạc bác sĩ thú y thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Cập nhật danh sách liên lạc
        const updatedContacts = contacts.map((c) =>
          c.id === contact.id ? { ...c, ...response.json() } : c
        );
        setContacts(updatedContacts);

        onClose();
      } else {
        // Xử lý lỗi
        console.error('Lỗi khi cập nhật liên lạc bác sĩ thú y');
        toast({
          title: 'Lỗi!',
          description: 'Lỗi khi cập nhật liên lạc bác sĩ thú y',
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa liên lạc bác sĩ thú y</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="start">
              <FormControl>
                <FormLabel>Tên liên lạc:</FormLabel>
                <Input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </FormControl>
              {/* Các trường input khác tương tự như AddVeterinarianContact */}
              <FormControl>
                <FormLabel>Giới tính:</FormLabel>
                <Select value={contactGender} onChange={(e) => setContactGender(e.target.value)}>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Select>
              </FormControl>
              <FormControl>
                  <FormLabel>Ngôn ngữ:</FormLabel>
                  <Input
                    type="text"
                    value={contactLanguage}
                    onChange={(e) => setContactLanguage(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Số điện thoại:</FormLabel>
                  <Input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Địa chỉ:</FormLabel>
                  <Input
                    type="text"
                    value={vetAddress}
                    onChange={(e) => setVetAddress(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email:</FormLabel>
                  <Input
                    type="email"
                    value={vetEmail}
                    onChange={(e) => setVetEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Chuyên khoa:</FormLabel>
                  <Input
                    type="text"
                    value={vetSpeciality}
                    onChange={(e) => setVetSpeciality(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Phòng khám:</FormLabel>
                  <Input
                    type="text"
                    value={vetClinic}
                    onChange={(e) => setVetClinic(e.target.value)}
                  />
                </FormControl>
              {/* Các trường input khác tương tự như AddVeterinarianContact */}
              <Button type="submit" mt={4} colorScheme="blue">
                Lưu thay đổi
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VeterinarianContactEdit;