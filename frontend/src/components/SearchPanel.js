'use client';

import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchPanel = () => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search chats"
        variant="filled"
        bg="gray.100"
        borderRadius="md"
        _hover={{ bg: 'gray.200' }}
        _focus={{ bg: 'white', borderColor: 'blue.500' }}
      />
    </InputGroup>
  );
};

export default SearchPanel;