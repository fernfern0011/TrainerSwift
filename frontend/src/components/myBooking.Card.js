"use client"
import { Card, Flex, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Box } from '@chakra-ui/react';
import { ChatIcon, CalendarIcon, PhoneIcon } from '@chakra-ui/icons';

export default function BookingCard({booking, traineeDetails}) {


    if (!traineeDetails) {
        return <p>Loading...</p>;
    }

    return (
        <Flex justifyContent="center">
            <Box width="80%" margin="1%">
                <Card
                    direction={{ base: 'column', sm: 'row' }}
                    overflow='hidden'
                    variant='outline'
                >
                    <Flex justifyContent='space-between' width='100%'>
                        <Stack>
                            <CardBody>
                                <Heading size='md'>{traineeDetails.package_name}</Heading>
                                <Text>
                                    Location: {traineeDetails.address}
                                </Text>
                                <Flex alignItems='flex-end' paddingTop='5%'>
                                    <Button variant='solid' colorScheme='red' mr="2%" as='a' href={'/chat'}>
                                        Chat
                                        <ChatIcon ml='5px' />
                                    </Button>
                                    {booking.ispremium && (
                                        <Button variant='solid' colorScheme='red' as='a' href={'/diet'} mr="2%" >
                                            Macro
                                            <CalendarIcon ml='5px' />
                                        </Button>
                                    )}
                                    {traineeDetails.mode == "online" && (
                                        <Button variant='solid' colorScheme='red' as='a' href={'/video-conferencing-trainee'} >
                                            Video Chat
                                            <PhoneIcon ml='5px' />
                                        </Button>
                                    )}
                                </Flex>
                            </CardBody>
                        </Stack>

                        

                        <Flex>
                            <Flex alignItems='flex-end'>
                                <Stack>
                                    <CardBody textAlign="right">
                                        <Text fontSize='lg'>{traineeDetails.availability_day}</Text>
                                        <Heading size='lg'>
                                        {traineeDetails.availability_time}
                                        </Heading>
                                    </CardBody>
                                </Stack>
                            </Flex>
                            <Image
                                objectFit='cover'
                                maxW={{ base: '100%', sm: '200px' }}
                                src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                                alt='Caffe Latte'
                            />
                        </Flex>
                    </Flex>
                </Card>
            </Box>
        </Flex>
    );
}