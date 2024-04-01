'use client'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//   import bgImage from '../assets/sign-up.jpg'; 
// import axios from "axios";

export default function ClientLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    setLoading(true)
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const response = await fetch('/api/auth/trainee-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    if (result.code == 201) {
      setLoading(false)
      const traineeinfo = JSON.stringify(result.traineeinfo)

      // set cookies
      document.cookie = `token=${result.token}; path=/`
      document.cookie = `traineeinfo=${traineeinfo}; path=/`
      window.location.href = '/search-trainer'
    } else {
      setError('Failed to login. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Box
      // bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Trainee Sign In
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={20}>
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" name='email' placeholder="Email" required />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" placeholder="Password" required />
              </FormControl>
              {error ?
                <Text color={"red"} mt={'15px'}>{error}</Text>
                : ""}
              <Stack spacing={10}>
                <Button
                  mt={'15px'}
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type="submit"
                  isLoading={loading ? true : false}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
