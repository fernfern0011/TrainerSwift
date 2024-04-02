'use client'

import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react'

const Testimonial = (props) => {
  const { children } = props

  return <Box>{children}</Box>
}

const TestimonialContent = (props) => {
  const { children } = props

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
      {children}
    </Stack>
  )
}

const TestimonialHeading = (props) => {
  const { children } = props

  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  )
}

const TestimonialText = (props) => {
  const { children } = props

  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  )
}

const TestimonialAvatar = ({
  src,
  name,
  title,
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} mb={2} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  )
}

export default function Qualities() {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')}>
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={'center'}>
          <Heading>About us</Heading>
          <Text>Online Marketplace for anything Fitness</Text>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 20 }}>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Expert Guidance</TestimonialHeading>
              <TestimonialText>
                Our team of certified trainers provides expert guidance to help
                you achieve your fitness goals effectively.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://randomuser.me/api/portraits/women/1.jpg'
              }
              name={'Swetha Gottipati'}
              title={'Certified Personal Trainer'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Customized Workouts</TestimonialHeading>
              <TestimonialText>
                We understand that everyone's fitness journey is unique. That's
                why we offer customized workout plans tailored to your
                individual needs and preferences.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://randomuser.me/api/portraits/men/2.jpg'
              }
              name={'Chris Poskitt'}
              title={'Fitness Coach'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Community Support</TestimonialHeading>
              <TestimonialText>
                Join our vibrant fitness community and get the support you need
                to stay motivated and committed to your fitness journey.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://randomuser.me/api/portraits/women/3.jpg'
              }
              name={'Lily Kong'}
              title={'Fitness Enthusiast'}
            />
          </Testimonial>
        </Stack>
      </Container>
    </Box>
  )
}