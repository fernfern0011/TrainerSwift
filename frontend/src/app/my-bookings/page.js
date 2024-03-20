'use client'
import { Box, Flex } from '@chakra-ui/react'
import BookingCard from '../../components/bookingCard'
import SearchBar from '../../components/searchBar'

export default function Landing() {
    return (
        <Box padding="2%">
            <Flex justifyContent='center' paddingBottom='5px'>
                <SearchBar />
            </Flex>
            <BookingCard />
            <BookingCard />
            <BookingCard />
        </Box>
    )
}