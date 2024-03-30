'use client'
import { Box, Flex } from '@chakra-ui/react'
import SearchBar from '../../../components/searchBar'
import ClientCard from './../../../components/clientCard';

export default function MyClientPage() {

    const sampleData = Array.from({ length: 12 }, (_, index) => ({
        id: index + 1, // Assuming you have an 'id' field in your PostCard component
        // Add other fields as needed
        title: `Cruel Summer Yoga Session`,
        content: `By: John Doe`,
        // Add other fields as needed
    }));

    return (
        <Box padding="2%">
            <Flex justifyContent='center' paddingBottom='5px'>
                <SearchBar />
            </Flex>
            {sampleData.map((data) => (
                <ClientCard key={data.id} {...data} />))}
        </Box>
    )
}