'use client'
import {
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Checkbox
} from '@chakra-ui/react';
import { useState } from 'react';

export default function AddMeal() {
  return (
    <Box
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Add Meal
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={20}>
          <Stack spacing={4}>
            <FormControl id="foodname">
              <FormLabel>Food Name</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl id="quantity">
              <FormLabel>Quantity (in grams)</FormLabel>
              <Input type="number" />
            </FormControl>
            <Stack spacing={4}>
              <Button
                mt={1}
                colorScheme="blue"
                variant="outline"
                // bg={'blue.400'}
                // color={'white'}
                _hover={{
                  bg: 'blue.500',
                  color: 'white'
                }}
                as={'a'} href={'/diet'}
              >
                Add Meal
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
