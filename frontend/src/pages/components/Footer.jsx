// Footer.jsx
import { Flex, Text } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Flex bg="#1A4742" color="white" p={4} justifyContent="center">
            <Text>
                &copy; {new Date().getFullYear()} Pet Guardian - All rights reserved.
            </Text>
        </Flex>
    );
};

export default Footer;