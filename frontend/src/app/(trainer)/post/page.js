"use client"

import React, { useState, useEffect } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { SimpleGrid, Box, Flex, Button, Text, Heading, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'
import SearchBar from '../../../components/searchBar';
import TrainerPostCard from '../../../components/trainerPostCard';
import Cookies from 'js-cookie'

export default function Post() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [postList, setPostList] = useState([])
    const [error, setError] = useState('')
    const [checkToken, setCheckToken] = useState('')

    useEffect(() => {
        const token = Cookies.get('token')
        const trainerinfo = Cookies.get('trainerinfo')
        var trainerid

        if (!token) {
            router.replace('/') // If no token is found, redirect to login page
            return
        }

        if (!(trainerinfo === undefined)) {
            trainerid = JSON.parse(trainerinfo)
        }

        setCheckToken(token)
        setLoading(true)
        const fetchPostData = async () => {
            const response = await fetch(`http://localhost:3000/api/post?trainerid=${trainerid.trainerid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })

            // if post successfully fetched
            const result = await response.json()

            if (result.code == 200) {
                setPostList(result.data.post)
                setLoading(false)
            } else {
                setError('Failed to retrieve post data.')
                setLoading(false)
            }
        }

        fetchPostData().catch((e) => {
            // handle the error as needed
            console.error('An error occurred while fetching the data: ', e)
        })
    }, [])

    return (
        <Box p={20}>
            {checkToken == "" ?
                <Flex m={'auto'} justifyContent={'center'}>
                    <Spinner />
                </Flex>
                : (
                    <>
                        <Heading mb={10}>Post List</Heading>
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
                            <Text width={'fit-content'} m={'auto'} pt={'50px'}>Retrieving post data...</Text> : (
                                error ?
                                    <Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>{error}</Text> :
                                    <SimpleGrid columns={2} spacing={4} mt={4}>
                                        {postList.map((post) => (
                                            <TrainerPostCard key={post.postid} {...post} />
                                        ))}
                                    </SimpleGrid>
                            )}
                    </>
                )}
        </Box>
    );
}
