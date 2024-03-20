"use client"
import { AddIcon } from '@chakra-ui/icons'
import { SimpleGrid, Box, Flex, Button, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'
import SearchBar from '../../../components/searchBar';
import PostCard from '../../../components/postCard';

export default function Post() {
  const router = useRouter()
  // Generate sample data for 15 components
  const sampleData = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1, // Assuming you have an 'id' field in your PostCard component
    // Add other fields as needed
    title: `Post ${index + 1}`,
    content: `Content of post ${index + 1}`,
    // Add other fields as needed
  }));

  return (
    <Box p={20}>
      <Flex justifyContent='center' paddingBottom='5px' gap='3'>
        <SearchBar mr={10} />
        <Button
                rightIcon={<AddIcon />}
                colorScheme={'blue'}
                variant={'solid'}
                borderRadius={'50px'}
                onClick={() => router.push('/post/create')}>
                Create Post
        </Button>
      </Flex>
      <SimpleGrid columns={2} spacing={4} mt={4}>
        {sampleData.map((data) => (
          <Box key={data.id} width="200%" height="100%">
            <PostCard {...data} />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
