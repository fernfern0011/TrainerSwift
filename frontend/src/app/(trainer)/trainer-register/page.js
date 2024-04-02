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
  InputGroup,
  InputRightElement,
  Stack,
  Image,
  useToast
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export default function TrainerRegister() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    return password.length >= 5;
  };

  async function handleSubmit(event) {
    setLoading(true)
    setError('')
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('name')

    // Validate Password
    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      setError('Password must be at least 5 characters long')
      setLoading(false)
    } else {
      setError('')
    }

    if (isValidPassword) {
      const response = await fetch('/api/auth/trainer-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, name }),
      })

      const result = await response.json()

      if (result.code == 201) {
        setLoading(false)

        // when registered successfully
        toast({
          title: 'Trainer account created successfully.',
          status: 'success',
          position: 'top-right',
          duration: 5000,
          isClosable: true,
        })

        router.push('/trainer-login')
      } else {
        setError('Failed to register. Please try again.')
        setLoading(false)
      }
    }
  }

  return (
    <Stack maxH={'83.5vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex flex={1} w={'full'}>
        <Image
          alt={'Register Image'}
          objectFit={'cover'}
          width={'inherit'}
          minH={'83.5vh'}
          src={'../assets/img/register_img.jpg'}
        />
      </Flex>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'lg'}>
          <Heading fontSize={'4xl'}>Register as a Trainer</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to be the change and empower people! ✌️
          </Text>
          <form onSubmit={handleSubmit}>
            <Flex gap={'10px'}>
              <FormControl id="name" mb={'1rem'} isRequired>
                <FormLabel>Name</FormLabel>
                <Input type="text" name='name' placeholder="Name" isRequired />
              </FormControl>
              <FormControl id="username" mb={'1rem'} isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" name='username' placeholder="Username" isRequired />
              </FormControl>
            </Flex>
            <FormControl id="email" mb={'1rem'} isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" name='email' placeholder="Email" isRequired />
            </FormControl>
            <FormControl id="password" mb={'1rem'} isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} name='password' placeholder="Password" isRequired />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {error ?
              <Text color={"red"} mb={'1rem'}>{error}</Text>
              : ""}
            <Stack spacing={6}>
              <Button
                colorScheme={'red'}
                variant={'solid'}
                type="submit"
                isLoading={loading ? true : false}
              >
                Register
              </Button>
            </Stack>
            <Stack pt={'3rem'} align={'center'}>
              <Flex gap={'10px'}>
                <Text> Ready to transform yourself? </Text>
                <Text color={'blue.400'} textDecorationLine={'underline'}>
                  <Link href={'/login'}>Register as a Trainee</Link>
                </Text>
              </Flex>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </Stack>
  )
}