"use client"

import { useState, useEffect } from 'react';
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
} from '@chakra-ui/react';

export default function Simple() {
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trainer/2');
        if (!response.ok) {
          throw new Error('Failed to fetch trainer information');
        }
        const data = await response.json();
        setTrainerInfo(data.data.trainerinfo);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxW={'7xl'}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}>
        <Flex>
          <Image
            rounded={'md'}
            alt={'product image'}
            src={trainerInfo ? trainerInfo.image : ''}
            fit={'cover'}
            align={'center'}
            w={'100%'}
            h={{ base: '120%', sm: '400px', lg: '550px' }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
              {trainerInfo ? trainerInfo.name : ''}
            </Heading>
            <Text
              color={useColorModeValue('gray.900', 'gray.400')}
              fontWeight={300}
              fontSize={'2xl'}>
              {trainerInfo ? trainerInfo.email : ''}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider borderColor={useColorModeValue('gray.200', 'gray.600')} />
            }>
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text
                color={useColorModeValue('gray.500', 'gray.400')}
                fontSize={'2xl'}
                fontWeight={'300'}>
                {trainerInfo ? `Age: ${new Date().getFullYear() - new Date(trainerInfo.dob).getFullYear()}, Height: ${trainerInfo.height}, Weight: ${trainerInfo.weight}` : ''}
              </Text>
              <Text fontSize={'lg'}>
                {trainerInfo ? trainerInfo.bio : ''}
              </Text>
            </VStack>
          </Stack>

          <Button
            rounded={'none'}
            w={'full'}
            mt={8}
            size={'lg'}
            py={'7'}
            bg={useColorModeValue('gray.900', 'gray.50')}
            color={useColorModeValue('white', 'gray.900')}
            textTransform={'uppercase'}
            _hover={{
              transform: 'translateY(2px)',
              boxShadow: 'lg',
            }}>
            Check out Packages!
          </Button>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
