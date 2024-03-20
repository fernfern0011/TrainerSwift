"use client"
import { Card, Flex, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Box } from '@chakra-ui/react';

export default function BookingCard() {
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
                                <Heading size='md'>Cruel Summer Yoga Session</Heading>
                                <Text py='2'>
                                    By: John Doe
                                </Text>
                                <Text>
                                    Location: Community Center
                                </Text>
                            </CardBody>
                        </Stack>

                        <Flex>
                            <Flex alignItems='flex-end'>
                                <Stack>
                                    <CardBody textAlign="right">
                                        <Text fontSize='lg'>Monday</Text>
                                        <Heading size='lg'>
                                            8:00 - 8:45AM
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
