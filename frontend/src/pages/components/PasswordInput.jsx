import {Button, Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import React from "react";

function PasswordInput({ value, onChange}) {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
        <InputGroup size='md'>
            <Input
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                placeholder='Enter password'
                size="lg" variant="outline" bg={"white"} borderRadius={58} border="1px"
                value={value}
                onChange={onChange}
            />

            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
    )
}
export default PasswordInput