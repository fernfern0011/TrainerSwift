"use client"

import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'
import SearchBar from '../../../components/searchBar';
import PostCard from '../../../components/postCard';
import Cookies from 'js-cookie'


export default function SearchTrainer() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [trainers, setTrainers] = useState([]);
  const [checkToken, setCheckToken] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = Cookies.get('token')
    const traineeinfo = Cookies.get('traineeinfo')

    if (!token) {
      router.replace('/') // If no token is found, redirect to login page
      return
    }

    setCheckToken(token)
    setLoading(true)
    const fetchTrainers = async () => {
      const response = await fetch('http://localhost:3000/api/trainer', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      })

      // if trainer successfully fetched
      const data = await response.json();
      if (data.code == 200) {
        setTrainers(data.data.trainerinfo);
        setLoading(false)
      } else {
        setError('Failed to retrieve trainer data.')
        setLoading(false)
      }
    };

    fetchTrainers().catch((e) => {
      // handle the error as needed
      console.error('An error occurred while fetching the data: ', e)
    })
  }, []);

  return (
    <>
      {checkToken == "" ? <Spinner m={'auto'} /> : (
        <Box p={20}>
          <Flex justifyContent='center' paddingBottom='5px'>
            <SearchBar />
          </Flex>
          {loading ?
            <Text width={'fit-content'} m={'auto'} pt={'50px'}>Retrieving trainer data...</Text> : (
              error ?
                <Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>{error}</Text> :
                <SimpleGrid columns={2} spacing={4} mt={4}>
                  {trainers.map((trainer) => (
                    <Box key={trainer.trainerid} width="200%" height="100%">
                      <PostCard key={trainer.trainerid} dob={trainer.dob} content={trainer.bio} />
                    </Box>
                  ))}
                </SimpleGrid>
            )}
        </Box>
      )}
    </>
  );
}