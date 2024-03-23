import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Icon,
    Box
  } from '@chakra-ui/react'
  
  import backgroundImage from '../assets/gym_img.png'
  
  export default function Hero() {
    return (
      <Box
        bgImage={`url(${backgroundImage})`}
        // bgColor={'#0c6ff0'}
        bgSize="cover"
        minH="500px"
        blur={'2px'}
      >
      <Container maxW={'5xl'} minH={'500px'}>
        <Stack
          textAlign={'center'}
          align={'center'}
          spacing={{ base: '200px', md: '45px' }}
          py={{ base: 24, md: '182px'}}
          minH={'100%'}>

        <Heading
          fontWeight={700}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          color={'black'}
          lineHeight={'110%'}>
          JOIN US TODAY!{' '}
        </Heading>
          <Stack spacing={6} direction={'row'}>
            <Button
              as={'a'}
              rounded={'full'}
              px={6}
              colorScheme={'blue.400'}
              bg={'#1A202C'}
              href={'/register'}
              _hover={{ bg: 'RGBA(0, 0, 0, 0.80)' }}>
              Get started
            </Button>
            <Button rounded={'full'} px={6}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
      </Box>
    )
  }