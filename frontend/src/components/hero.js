import {
  Container,
  Heading,
  Stack,
  Button,
  Box
} from '@chakra-ui/react'

export default function Hero() {
  return (
    <Box
      bgImage={`url(/assets/img/gym_img.png)`}
      bgSize="fill"
      minH="500px"
    >
      <Container maxW={'5xl'} minH={'500px'}>
        <Stack
          align={'center'}
          spacing={{ base: '200px', md: '45px' }}
          py={{ base: 24, md: '182px' }}
          minH={'100%'}>
          <Heading
            fontWeight={700}
            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
            color={'black'}>
            JOIN US TODAY!
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
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}