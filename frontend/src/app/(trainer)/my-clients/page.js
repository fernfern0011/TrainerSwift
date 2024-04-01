"use client"
import { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import ClientCard from '../../../components/clientCard';
import SearchBar from '../../../components/searchBar';

export default function MyClientPage() {
    const [bookings, setBookings] = useState([]);
    const [traineeDetails, setTraineeDetails] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const responseBookings = await fetch('http://localhost:3000/api/trainer-booking/1');
                if (!responseBookings.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const dataBookings = await responseBookings.json();
                setBookings(dataBookings.data.bookedby);

                const responseTraineeDetails = await fetch('http://localhost:3000/api/trainer-details/1');
                if (!responseTraineeDetails.ok) {
                    throw new Error('Failed to fetch trainee details');
                }
                const dataTraineeDetails = await responseTraineeDetails.json();
                setTraineeDetails(dataTraineeDetails.data.bookedby_details);
                console.log(dataTraineeDetails.data.bookedby_details)


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
            {bookings && bookings.length > 0 ? (
                bookings.map((booking, index) => (
                    <ClientCard
                        key={index}
                        booking={booking}
                        traineeDetails={traineeDetails[index]} // Pass corresponding traineeDetails
                    />
                ))
            ) : (
                <p>No bookings found.</p>
            )}

        </Box>
    );
}