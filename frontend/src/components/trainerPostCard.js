"use client"

import React, { useState } from 'react'
import { Card, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Box, HStack, Tag, Spinner, useToast } from '@chakra-ui/react';
import { ArrowForwardIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export default function trainerPostCard(data) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleDelete = async (postid) => {
    setLoading(true)

    const response = await fetch('http://localhost:3000/api/post', {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          postid: postid
        })
    })

    // if post successfully deleted
    const result = await response.json()

    if (result.code == 200) {
      setLoading(false)

      // whenever post is successfully deleted
      toast({
        title: 'Post is deleted.',
        status: 'success',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      })

    } else {
      setLoading(false)

      // whenever post is failed to delete
      toast({
        title: 'Failed to delete post. Post is not empty',
        status: 'error',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (

    <Box m={'auto'} >
      {loading ? <Spinner /> :
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
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
              <Link href={{
                pathname: `/post/${data.postid}`,
                query: { title: data.title }
              }}>
                <Button variant='solid' colorScheme='red' mr={5}>
                  Check Packages
                  <ArrowForwardIcon mt={0.5} ml={1} />
                </Button>
              </Link>
              <EditIcon boxSize={5} mr={'15px'} cursor={'pointer'} />
              <DeleteIcon boxSize={5} onClick={() => handleDelete(data.postid)} cursor={'pointer'} />
            </CardFooter>
          </Stack>

          <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src={data.image != '' ? data.image : 'https://placehold.co/200x200'}
            alt='Caffe Latte'
          />
        </Card>
      }
    </Box >
  );
}
