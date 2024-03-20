import { SimpleGrid, Box, Flex } from '@chakra-ui/react';
import SearchBar from './../../../components/searchBar';
import PostCard from '../../../components/postCard';

export default function SearchTrainer() {
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
      <Flex justifyContent='center' paddingBottom='5px'>
        <SearchBar />
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