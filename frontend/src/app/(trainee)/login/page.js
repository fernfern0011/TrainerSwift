'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
} from '@chakra-ui/react'
import Link from 'next/link';

export default function TraineeLogin() {
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
    <Stack maxH={'83.5vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'4xl'}>Trainee Login</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="email" mb={'1rem'} isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" name='email' placeholder="Email" isRequired />
            </FormControl>
            <FormControl id="password" mb={'1rem'} isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" placeholder="Password" isRequired />
            </FormControl>
            {error ?
              <Text color={"red"} mb={'1rem'}>{error}</Text>
              : ""}
            <Stack spacing={6}>
              <Button
                colorScheme={'red'}
                variant={'solid'}
                type="submit"
                isLoading={loading ? true : false}>
                Login
              </Button>
              <Button
                colorScheme={'gray'}
                variant={'solid'}
                onClick={() => router.push('/register')}>
                Register
              </Button>
            </Stack>
            <Stack pt={'3rem'}>
              <Text align={'center'} color={'blue.400'} textDecorationLine={'underline'}>
                <Link href={'/trainer-login'}>Login as Trainer</Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Flex>
      <Flex flex={1} w={'full'}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          width={'inherit'}
          minH={'83.5vh'}
          src={'../assets/img/login_img.jpg'}
        />
      </Flex>
    </Stack>
  )
}