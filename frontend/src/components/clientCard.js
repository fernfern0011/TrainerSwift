"use client"
import { Card, Flex, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Box } from '@chakra-ui/react';
import { ChatIcon, CalendarIcon, PhoneIcon } from '@chakra-ui/icons';

export default function ClientCard({ booking, traineeDetails }) {


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
                                    <Button variant='solid' colorScheme='red' mr="2%">
                                        Chat
                                        <ChatIcon ml='5px' />
                                    </Button>
                                    {booking.ispremium && (
                                        <Button variant='solid' colorScheme='red' as='a' href={'/diet'} mr="2%" >
                                            Macro
                                            <CalendarIcon ml='5px' />
                                        </Button>
                                    )}
                                    {traineeDetails.mode == "offline" && (
                                        <Button variant='solid' colorScheme='red' as='a' href={'/'} >
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
                        </Flex>
                    </Flex>
                </Card>
            </Box>
        </Flex>
    );
}
