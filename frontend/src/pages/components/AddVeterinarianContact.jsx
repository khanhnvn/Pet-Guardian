import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Select,
} from '@chakra-ui/react';

const AddVeterinarianContact = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contactName, setContactName] = useState('');
  const [contactGender, setContactGender] = useState('');
  const [contactLanguage, setContactLanguage] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [vetAddress, setVetAddress] = useState('');
  const [vetEmail, setVetEmail] = useState('');
  const [vetSpeciality, setVetSpeciality] = useState('');
  const [vetClinic, setVetClinic] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/veterinarian_contacts', {
        method: 'POST',
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
          title: 'Thêm liên lạc bác sĩ thú y thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Reset form và đóng modal
        setContactName('');
        setContactGender('');
        setContactLanguage('');
        setContactPhone('');
        setVetAddress('');
        setVetEmail('');
        setVetSpeciality('');
        setVetClinic('');
        onClose();
      } else {
        // Xử lý lỗi
        console.error('Lỗi khi thêm liên lạc bác sĩ thú y');
        toast({
          title: 'Lỗi!',
          description: 'Lỗi khi thêm liên lạc bác sĩ thú y',
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
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Thêm liên lạc bác sĩ thú y
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm liên lạc bác sĩ thú y</ModalHeader>
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
                <Button type="submit" mt={4} colorScheme="blue">
                  Thêm liên lạc
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddVeterinarianContact;