"use client"
import { AddIcon } from '@chakra-ui/icons'
import { SimpleGrid, Box, Flex, Button, Stack, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'
import SearchBar from '../../../components/searchBar';
import PackageCard from '../../../components/packageCard'

export default function Package() {
  const router = useRouter()
  // Generate sample data for 15 components
  const sampleData = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1, // Assuming you have an 'id' field in your PostCard component
    // Add other fields as needed
    title: `Package ${index + 1}`,
    content: `Description of Package ${index + 1}`,
    // Add other fields as needed
  }));

  return (
    <Box p={20}>
      <Heading as='u' mb={20}>My Packages</Heading>  
      <Flex justifyContent='center' paddingBottom='2px' gap='2' mt={5}>
        <SearchBar mr={10} />
        <Button
                rightIcon={<AddIcon />}
                colorScheme={'blue'}
                variant={'solid'}
                borderRadius={'50px'}
                onClick={() => router.push('/package/create')}>
                Create Package
        </Button>
      </Flex>
      <SimpleGrid columns={3} spacing={4} mt={4}>
        {sampleData.map((data) => (
          <Box key={data.id} width="100%" height="100%">
            {/* <PackageCard {...data} /> */}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
