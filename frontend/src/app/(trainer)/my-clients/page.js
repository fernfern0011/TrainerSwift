"use client"

import { useState, useEffect } from 'react';
import { Box, Flex, Spinner, Text, SimpleGrid, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'
import ClientCard from '../../../components/clientCard';
import SearchBar from '../../../components/searchBar';
import Cookies from 'js-cookie'

export default function MyClientPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [bookings, setBookings] = useState([]);
    const [traineeDetails, setTraineeDetails] = useState([]);
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
        const fetchBookings = async () => {
            try {
                const responseBookings = await fetch(`http://localhost:3000/api/trainer-booking/${trainerid.trainerid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })

                // if booking successfully fetched
                const dataBookings = await responseBookings.json();
                console.log(dataBookings);

                if (dataBookings.code == 200) {

                    const responseTraineeDetails = await fetch(`http://localhost:3000/api/trainer-details/${trainerid.trainerid}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        }
                    });

                    const dataTraineeDetails = await responseTraineeDetails.json();
                    console.log(dataTraineeDetails);

                    if (dataTraineeDetails.code == 200) {
                        setBookings(dataBookings.data.bookedby);
                        setTraineeDetails(dataTraineeDetails.data.bookedby_details);
                        setLoading(false)
                    }
                } else {
                    setError('Failed to retrieve booking data.')
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings().catch((e) => {
            // handle the error as needed
            console.error('An error occurred while fetching the data: ', e)
        })
    }, []);

    console.log(bookings, traineeDetails);

    return (
        <Box p={20}>
            {checkToken == "" ?
                <Flex m={'auto'} justifyContent={'center'}>
                    <Spinner />
                </Flex> : (
                    <>
                        <Heading mb={10}>Booking List</Heading>
                        <Flex justifyContent='center' paddingBottom='5px' gap='3'>
                            <SearchBar mr={10} />
                        </Flex>
                        {loading ?
                            <Text width={'fit-content'} m={'auto'} pt={'50px'}>Retrieving booking data...</Text> : (
                                error ?
                                    <Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>{error}</Text> :
                                    <SimpleGrid mt={4}>
                                        {bookings && bookings.length > 0 ? (
                                            bookings.map((booking, index) => (
                                                <ClientCard
                                                    key={index}
                                                    booking={booking}
                                                    traineeDetails={traineeDetails[index]} // Pass corresponding traineeDetails
                                                />
                                            ))
                                        ) : <Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>{error}</Text>}
                                    </SimpleGrid>
                            )
                        }
                    </>
                )
            }
        </Box>
    );
}