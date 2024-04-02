"use client"
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from '@chakra-ui/react';

export default function CheckoutReceipt() {

    return (
        <Card>
            <CardHeader>
                <Heading size='lg' >Summary</Heading>
            </CardHeader>
            <CardBody mt={'-25px'}>
                <Stack divider={<StackDivider />} spacing='4'>
                    <Box>
                        <div>
                            <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                                Trainer:
                            </Heading>
                            <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                                John Doe
                            </Text>
                        </div>
                        <div>
                            <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                                Trainee:
                            </Heading>
                            <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                                123456
                            </Text>
                        </div>
                    </Box>
                    <Box>
                        <div>
                            <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                                Package:
                            </Heading>
                            <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                                Morning Yoga Session
                            </Text>
                        </div>
                        <div>
                            <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                                Day:
                            </Heading>
                            <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                                Monday
                            </Text>
                        </div>
                        <div>
                            <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                                Time:
                            </Heading>
                            <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                                8AM
                            </Text>
                        </div>
                        <div>
                            <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                                Location:
                            </Heading>
                            <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                                To be discussed
                            </Text>
                        </div>
                    </Box>
                    <Box>
                        <div>
                            <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                                Total Cost:
                            </Heading>
                            <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                                120
                            </Text>
                        </div>
                    </Box>
                </Stack>
            </CardBody>
        </Card>
    )
}