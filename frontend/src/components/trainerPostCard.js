"use client"

import React, { useState } from 'react'
import { Card, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Box, HStack, Tag } from '@chakra-ui/react';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';

export default function trainerPostCard(data) {

  const handleDelete = () => {
    alert("click")
  }

  return (
    <Box>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
        width="50%"
        id={data.postid}
      >
        <Stack>
          <CardBody>
            <HStack mb={2}>
              <Tag size={'sm'} variant='solid' colorScheme='teal'>
                {data.category}
              </Tag>
            </HStack>
            <Heading size='md'>{data.title}</Heading>
            <Text py='2' noOfLines={[3]} pb={0}>
              {data.description}
            </Text>
          </CardBody>

          <CardFooter alignItems={'center'}>
            <Button variant='solid' colorScheme='red' mr={5}>
              Check Packages
              <ArrowForwardIcon mt={0.5} ml={1} />
            </Button>
            <DeleteIcon boxSize={5} onClick={handleDelete} cursor={'pointer'} />
          </CardFooter>
        </Stack>

        <Image
          objectFit='cover'
          maxW={{ base: '100%', sm: '200px' }}
          src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
          alt='Caffe Latte'
        />
      </Card>
    </Box >
  );
}
