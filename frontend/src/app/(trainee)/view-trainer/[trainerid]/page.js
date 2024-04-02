"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import {
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue, Box, IconButton, Spinner, SimpleGrid
} from '@chakra-ui/react'
import BookingCard from '@/components/bookingCard';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import Cookies from 'js-cookie'

export default function ViewTrainerPackage({ params }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [trainerInfo, setTrainerInfo] = useState(null)
    const [packagelist, setPackagelist] = useState([])
    const [error, setError] = useState('');
    const [checkToken, setCheckToken] = useState('')

    useEffect(() => {
        const token = Cookies.get('token')

        if (!token) {
            router.replace('/') // If no token is found, redirect to login page
            return
        }

        setCheckToken(token)
        setLoading(true)
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/trainer/${params.trainerid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });

                const result = await response.json()

                if (result.code == 200) {
                    setTrainerInfo(result.data.trainerinfo);
                    setLoading(false)

                    const response = await fetch(`http://localhost:3000/api/view-package/${params.trainerid}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })

                    // if package successfully fetched
                    const packageResult = await response.json()

                    if (packageResult.code == 200) {
                        setPackagelist(packageResult.data.package)
                    } else if (result.code == 400) {
                        setError('There is no package.')
                        setLoading(false)
                    } else {
                        setError('Failed to retrieve package data.')
                        setLoading(false)
                    }
                } else {
                    setError('Failed to retrieve trainer info.')
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().catch((e) => {
            // handle the error as needed
            console.error('An error occurred while fetching the data: ', e)
        })
    }, []);

    return (
        <Box p={20}>
            {checkToken == "" ?
                <Flex m={'auto'} justifyContent={'center'}>
                    <Spinner />
                </Flex> : (
                    <>
                        {loading ?
                            <Text width={'fit-content'} m={'auto'} pt={'50px'}>Retrieving trainerinfo...</Text> : (
                                error ?
                                    <Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>{error}</Text> :
                                    <Stack direction='column' align={'center'} mb={10} alignItems={'flex-start'}>
                                        <IconButton
                                            isRound={true}
                                            variant='solid'
                                            colorScheme='teal'
                                            aria-label='Done'
                                            fontSize='36px'
                                            mr={'10px'}
                                            icon={<ChevronLeftIcon />}
                                            onClick={() => router.push('/search-trainer')}
                                        />

                                        <Stack
                                            m={'auto'}
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            w={'lg'}
                                            height={{ sm: '476px', md: '20rem' }}
                                            direction={{ base: 'column', md: 'row' }}
                                        >
                                            <Flex flex={1} bg="blue.200">
                                                <Image
                                                    objectFit="cover"
                                                    boxSize="100%"
                                                    src={
                                                        'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                                                    }
                                                    alt="#"
                                                />
                                            </Flex>

                                            <Stack
                                                flex={1}
                                                flexDirection="column"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={'2rem'}
                                                p={1}
                                                pt={2}>
                                                <Heading fontSize={'2xl'} fontFamily={'body'}>
                                                    {trainerInfo.name}
                                                </Heading>
                                                <Stack direction={'row'} justify={'center'} spacing={6}>
                                                    <Stack spacing={0} align={'center'}>
                                                        <Text fontWeight={600}>{trainerInfo.height}</Text>
                                                        <Text fontSize={'sm'} color={'gray.500'}>
                                                            Height
                                                        </Text>
                                                    </Stack>
                                                    <Stack spacing={0} align={'center'}>
                                                        <Text fontWeight={600}>{trainerInfo.weight}</Text>
                                                        <Text fontSize={'sm'} color={'gray.500'}>
                                                            Weight
                                                        </Text>
                                                    </Stack>
                                                </Stack>
                                                <Text
                                                    textAlign={'center'}
                                                    color={useColorModeValue('gray.700', 'gray.400')}
                                                    px={3}>
                                                    {trainerInfo.bio}
                                                </Text>
                                            </Stack>
                                        </Stack>

                                        <SimpleGrid columns={2} spacing={5} mt={4}>
                                            {packagelist.map((data) => (
                                                <BookingCard key={data.packageid} {...data} trainerid={parseInt(params.trainerid)} />
                                            ))}
                                        </SimpleGrid>
                                    </Stack>
                            )}
                    </>
                )}
        </Box >
    );
}
