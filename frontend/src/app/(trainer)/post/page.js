"use client"

import React, { useState, useEffect } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { SimpleGrid, Box, Flex, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'
import SearchBar from '../../../components/searchBar';
import TrainerPostCard from '../../../components/trainerPostCard';

export default function Post() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            const response = await fetch('http://localhost:3000/api/post', {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            // if post successfully fetched
            const result = await response.json()
            if (result.code == 200) {
                setData(result.data.post)
                setLoading(false)
            } else {
                setError('Failed to retrieve post data.')
                setLoading(false)
            }
        }

        fetchData().catch((e) => {
            // handle the error as needed
            console.error('An error occurred while fetching the data: ', e)
        })
    }, [])

    return (
        <Box p={20}>
            <Flex justifyContent='center' paddingBottom='5px' gap='3'>
                <SearchBar mr={10} />
                <Button
                    rightIcon={<AddIcon />}
                    colorScheme={'blue'}
                    variant={'solid'}
                    borderRadius={'50px'}
                    onClick={() => router.push('/post/create')}>
                    Create Post
                </Button>
            </Flex>
            {loading ?
                <Text width={'fit-content'} m={'auto'} pt={'50px'}>Retriving post data...</Text> : (
                    error ?
                        <Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>{error}</Text> :
                        <SimpleGrid columns={2} spacing={4} mt={4}>
                            {data.map((data) => (
                                <TrainerPostCard key={data.postid} {...data} />
                            ))}
                        </SimpleGrid>
                )}
        </Box >
    );
}
