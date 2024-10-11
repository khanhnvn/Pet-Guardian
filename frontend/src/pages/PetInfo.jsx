//PetInfo.jsx
import {
    Box, Container
} from '@chakra-ui/react';
import Navbar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import AddPet from "./components/AddPet.jsx";
import ShowPet from "./components/ShowPet.jsx";
import {useState} from "react";

const PetInfo = () => {
    const [pets, setPets] = useState([]);
    return (
        <Box bg="#FFFCF8" minHeight="100vh"
             display="flex" flexDirection="column"
        > {/* Đặt màu nền cho trang */}
            {/* Navigation Bar */}
            <Navbar />

            {/* Body */}
            <Box flex={1}>
                <Container maxW="container.lg" p={4}>
                    <AddPet /> {/* Component thêm thú cưng */}
                    <ShowPet pets={pets} setPets={setPets} /> {/* Component hiển thị danh sách thú cưng */}
                </Container>
            </Box>

            {/* Footer */}
            <Footer />


        </Box>
    );
};

export default PetInfo;