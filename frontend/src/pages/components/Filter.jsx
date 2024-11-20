import {
    Button,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    Box
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

function Filter({ onFilterChange }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleFilterChange = (filter) => {
        onFilterChange(filter);
        onClose(); // Đóng modal khi chọn filter
    };

    const handleCustomFilter = (date) => {
        // Chuyển đổi date thành format phù hợp để gửi lên backend
        const formattedDate = date.toISOString().slice(0, 10);
        onFilterChange(`custom:${formattedDate}`);
        onClose();
    };

    return (
        <>
            <Button onClick={onOpen}>Lọc</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Chọn khoảng thời gian</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4} align="center" justify="center">
                            <Button onClick={() => handleFilterChange('today')}>Hôm nay</Button>
                            <Button onClick={() => handleFilterChange('yesterday')}>Hôm qua</Button>
                            <Button onClick={() => handleFilterChange('this_week')}>Tuần này</Button>
                            <Button onClick={() => handleFilterChange('last_week')}>Tuần trước</Button>
                            <Button onClick={() => handleFilterChange('this_month')}>Tháng này</Button>
                            <Button onClick={() => handleFilterChange('last_month')}>Tháng trước</Button>
                            <Button onClick={() => handleFilterChange('custom')}>Tất cả</Button>
                        </Stack>
                        {isOpen && (
                            <Box mt={4}> Chọn ngày  *    
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    onSelect={handleCustomFilter}
                                    placeholderText="Chọn ngày"
                                    className="react-datepicker"
                                />
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default Filter;
