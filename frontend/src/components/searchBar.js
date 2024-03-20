'use client'

import {
  Box, Input, InputGroup, Button, InputRightElement
} from '@chakra-ui/react'

import { SearchIcon } from '@chakra-ui/icons';

function SearchBar() {
  return (
    <Box maxWidth="400px" width='80%'>
        <InputGroup size='md'>
            <Input
                pr='4.5rem'
                placeholder=''
                borderRadius={20}
            />
            <InputRightElement width='3rem' bg='inherit'>
                <Button h='1.75rem' size='sm' borderRadius={30}>
                    <SearchIcon/>
                </Button>
            </InputRightElement>
        </InputGroup>
    </Box>
  )
}

export default SearchBar;