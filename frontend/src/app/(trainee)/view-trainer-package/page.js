"use client"
import React, { useState, useEffect } from 'react';
import PackageCard from '../../../components/packageCard';
import { Button, Image, Heading, Text, Box } from '@chakra-ui/react'
import SearchTrainer from '../search-trainer/page';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


export default function ViewTrainerPackage() {

    const [trainerInfo, setTrainerInfo] = useState(null);
    const [error, setError] = useState(null);
    const [checkToken, setCheckToken] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token')
        const traineeinfo = Cookies.get('traineeinfo')
        var traineeid

        if (!token) {
            router.replace('/') // If no token is found, redirect to login page
            return
        }

        if (!(traineeinfo === undefined)) {
            traineeid = JSON.parse(traineeinfo)
        }

        setCheckToken(token)
        const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/trainer/1', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch trainer information');
            }
            const data = await response.json();
            setTrainerInfo(data.data.trainerinfo);
        } catch (error) {
            setError(error.message);
        }
        };

        fetchData();
    }, []);

    return (
        <Box>
            <Button
                borderRadius="full"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                ml={'10px'}
                mt={'-390px'}
                backgroundColor='black'
                color='white'
                as={'a'}
                href={'/view-trainer-profile'}
            >
                <ChevronLeftIcon boxSize={6} />
            </Button>
            <Box style={{ display: 'inline-block' }} mt={"25px"} ml={'25%'}>
                <Box style={{ display: 'inline-block' }}>
                <Heading>
                    {trainerInfo ? `${trainerInfo.name}, ${new Date().getFullYear() - new Date(trainerInfo.dob).getFullYear()}` : ''}
                </Heading>

                    <Box>
                        <Text style={{ display: 'inline-block' }}>
                        Height: {trainerInfo ? trainerInfo.height : ''}cm
                        </Text>
                    </Box>
                    <Box>
                        <Text style={{ display: 'inline-block' }}>
                        Weight: {trainerInfo ? trainerInfo.weight : ''}kg
                        </Text>
                    </Box>
                    <Box mt={"70px"}>
                        <Heading>
                            Packages    
                        </Heading>
                    </Box>
                </Box>
                <Box ml={'100px'} style={{ display: 'inline-block' }}>
                    <Image
                        borderRadius='full'
                        boxSize='200px'
                        src='https://placehold.co/200x200'
                        alt='Dan Abramov'
                    />
                </Box>
            </Box>
        </Box>
    );
}
