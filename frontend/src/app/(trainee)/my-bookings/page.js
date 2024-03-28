"use client"
import { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import BookingCard from '../../../components/bookingCard';
import SearchBar from '../../../components/searchBar';

export default function MyBookingPage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/trainee-booking');
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await response.json();
                setBookings(data.data.bookedby);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <Box padding="2%">
            <Flex justifyContent='center' paddingBottom='5px'>
                <SearchBar />
            </Flex>
            {bookings && bookings.length > 0 && bookings[0] ? (
                bookings.map((booking, index) => (
                    <BookingCard key={index} booking={booking} />
                ))
            ) : (
                <p>No bookings found.</p>
            )}

        </Box>
    );
}