"use client"
import { SimpleGrid, Box, Flex } from '@chakra-ui/react';
import SearchBar from '../../../components/searchBar';
import PostCard from '../../../components/postCard';
import { useState, useEffect } from 'react';

export default function SearchTrainer() {

  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trainer');
        if (!response.ok) {
          throw new Error('Failed to fetch trainers');
        }
        const data = await response.json();
        setTrainers(data.data.trainerinfo);
        console.log(data.data.trainerinfo)
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTrainers();
  }, []);


  return (
    <Box p={20}>
      <Flex justifyContent='center' paddingBottom='5px'>
        <SearchBar />
      </Flex>
      <SimpleGrid columns={2} spacing={4} mt={4}>
        {trainers.map((trainer) => (
        <Box key={trainer.trainerid} width="200%" height="100%">
          <PostCard key={trainer.trainerid} dob={trainer.dob} content={trainer.bio} />
        </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}