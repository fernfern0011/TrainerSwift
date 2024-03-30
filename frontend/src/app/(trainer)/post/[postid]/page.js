"use client"
import { useEffect, useState } from 'react';
import { AddIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import {
    SimpleGrid, Box, Flex, Button, Heading, Text, Stack, IconButton
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '../../../../components/searchBar';
import PackageCard from '../../../../components/packageCard'

export default function PackageByPostID({ params }) {
    const getTitle = useSearchParams()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [error, setError] = useState('')
    console.log(data);
    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/api/post/${params.postid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            // if package successfully fetched
            const result = await response.json()

            if (result.code == 200) {

                const updatedData = result.data.package.map(item => {
                    return { ...item, title: getTitle.get('title') }
                })

                setData(updatedData)
                setLoading(false)
            } else if (result.code == 400) {
                setError('There is no package.')
                setLoading(false)
            }
            else {
                setError('Failed to retrieve package data.')
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
            <Stack direction='row' align={'center'} mb={10}>
                <IconButton
                    isRound={true}
                    variant='solid'
                    colorScheme='teal'
                    aria-label='Done'
                    fontSize='36px'
                    mr={'10px'}
                    icon={<ChevronLeftIcon />}
                    onClick={() => router.push('/post')}
                />
                <Heading>{getTitle.get('title')} Packages</Heading>
            </Stack>
            <Flex justifyContent='center' paddingBottom='2px' gap='2' mt={5}>
                <SearchBar mr={10} />
                <Button
                    rightIcon={<AddIcon />}
                    colorScheme={'blue'}
                    variant={'solid'}
                    borderRadius={'50px'}
                    onClick={() => router.push(`/package/create?postid=${params.postid}&title=${getTitle.get('title')}`)}>
                    Create Package
                </Button>
            </Flex>
            {loading ?
                <Text width={'fit-content'} m={'auto'} pt={'50px'}>Retriving package data...</Text> : (
                    error
                        ?
                        <Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>{error}</Text> :
                        <SimpleGrid columns={2} spacing={5} mt={4}>
                            {data.map((data) => (
                                <PackageCard key={data.packageid} {...data} />
                            ))}
                        </SimpleGrid>
                )}
        </Box>
    );
}
