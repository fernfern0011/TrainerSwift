import { Box, Flex, Text, Badge, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { React } from 'react';

export default function PaymentHistory() {
    // Sample data
    const data = [
        { packageName: 'Apple', trainerName: '1', slot: '20g', dateTime: '1g', cost: '0.5g', status: 'Success'},
        { packageName: 'Banana', trainerName: '1', slot: '27g', dateTime: '1.3g', cost: '0.4g', status: 'Success'},
        { packageName: 'Banana', trainerName: '1', slot: '27g', dateTime: '1.3g', cost: '0.4g', status: 'Success'},
        // Add more sample data as needed
    ];

    return (
        <Flex justifyContent="center">
            <Box maxWidth="1200px" width="100%" mt={10}>
                {data.map((item, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="md"
                        marginBottom="4"
                    >
                        <Table variant="unstyled">
                            <Thead>
                                <Tr>
                                    <Th>Package Name</Th>
                                    <Th>Trainer Name</Th>
                                    <Th>Slot</Th>
                                    <Th>Date Time</Th>
                                    <Th>Cost</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>{item.packageName}</Td>
                                    <Td>{item.trainerName}</Td>
                                    <Td>{item.slot}</Td>
                                    <Td>{item.dateTime}</Td>
                                    <Td>{item.cost}</Td>
                                    <Td>
                                        <Badge colorScheme="green">{item.status}</Badge>
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                ))}
            </Box>
        </Flex>
    );
}
