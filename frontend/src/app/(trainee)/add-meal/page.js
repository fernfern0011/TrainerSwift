'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'
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

export default function AddMeal() {
  const [foodname, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const router = useRouter();

  const handleAddMeal = async () => {

    const postData = {
      traineeid: 7,
      foodname: foodname,
      quantity: parseInt(quantity)
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    };

    try {
      const response = await fetch('http://localhost:3000/api/add-meal', requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data); // Handle response data as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }

    router.push('/diet')
  };
  
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
              <Input type="text" onChange={(e) => setFoodName(e.target.value)} />
            </FormControl>
            <FormControl id="quantity">
              <FormLabel>Quantity</FormLabel>
              <Input type="number" onChange={(e) => setQuantity(e.target.value)} />
            </FormControl>
            <Stack spacing={4}>
              <Button
                mt={1}
                colorScheme="blue"
                variant="outline"
                onClick={handleAddMeal}
                // bg={'blue.400'}
                // color={'white'}
                _hover={{
                  bg: 'blue.500',
                  color: 'white'
                }}
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
