'use client'
import {
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
//   import bgImage from '../assets/sign-up.jpg'; 
// import axios from "axios";


export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEmailChange = (e) => {
    const isValidEmail = validateEmail(e.target.value);
    setFormData({ ...formData, email: e.target.value });

    if (!isValidEmail) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordChange = (e) => {
    const isValidPassword = validatePassword(e.target.value);
    setFormData({ ...formData, password: e.target.value });

    if (!isValidPassword) {
      setPasswordError('Password must be at least 5 characters long');
    } else {
      setPasswordError('');
    }
  };

  const validatePassword = (password) => {
    return password.length >= 5;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || passwordError) {
      // Skip form submission if there's an email validation error
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/stripe/stripe-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle success, e.g., redirect or show a success message
        const { url } = await response.json();
        window.location.href = url;
      } else {
        // Handle errors, e.g., show error messages to the user
        console.error('Failed to create account');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
            Sign up as a Trainer!
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8} minWidth={'400px'}>
          <Stack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" onChange={handleChange} />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={handleEmailChange} />
              {emailError && <Text color="red.500">{emailError}</Text>}
            </FormControl>
            {/* <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" onChange={handlePasswordChange} />
                {passwordError && <Text color="red.500">{passwordError}</Text>}
              </FormControl> */}
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={handlePasswordChange} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {passwordError && (
                <Text color="red" fontSize="sm" mt="1">
                  {passwordError}
                </Text>
              )}
            </FormControl>
            <Stack spacing={5} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <a href="/trainer-login" style={{ color: 'blue.400' }}>Login</a>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
