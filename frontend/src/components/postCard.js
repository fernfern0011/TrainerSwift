"use client"
import { Card, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Box } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export default function PostCard() {
  return (
    <Box>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
        width="50%"
      >
        <Image
          objectFit='cover'
          maxW={{ base: '100%', sm: '200px' }}
          src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
          alt='Caffe Latte'
        />

        <Stack>
          <CardBody>
            <Heading size='md'>John Doe, 24</Heading>
            <Text py='2'>
              Expert in:
              Yoga, Pilates, Swimming
            </Text>
          </CardBody>

          <CardFooter>
            <Button variant='solid' colorScheme='red'>
              Check Packages
              <ArrowForwardIcon mt={0.5} ml={1} />
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </Box>
  );
}
