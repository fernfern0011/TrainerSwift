"use client"
import { Heading, Spacer, Box, Flex, Button, Menu, MenuButton, MenuList, MenuItem, TableContainer, Table, TableCaption, Thead, Tr, Th, Td, Tbody, Tfoot, Center, Stack } from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { React, useState, useEffect } from 'react';

export default function DietPage() {
    const [meals, setMeals] = useState([]);
    const [calcData, setCalcData] = useState([]);
    const [type, setType] = useState('bulk');

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/diet/7');
                if (!response.ok) {
                    throw new Error('Failed to fetch meals');
                }
                const data = await response.json();
                console.log(data.data.meal)
                setMeals(data.data.meal);
            } catch (error) {
                console.error('Error fetching meals:', error);
            }
        };

        fetchMeals();
    }, []);

    useEffect(() => {
        const storedCalcData = JSON.parse(sessionStorage.getItem('calcData')).data.calcResult.data;
        console.log(storedCalcData);
        setCalcData(storedCalcData);
    }, []);

    // Function to generate an array of dates for the past 7 days
    const generatePastWeekDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        }
        return dates;
    };

    const dates = generatePastWeekDates();
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    return (
        <Box>
            <Flex alignItems="center" mt={5}>
                <Box bg="gray.200" pl={20} ml={5} height="325px" width="700px">
                    <Heading mt={20} mb={10} size='3xl'>My Diet</Heading>
                    <Stack direction="row" spacing={4}>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" variant="solid">
                                {selectedDate ? selectedDate : 'Date'}
                            </MenuButton>
                            <MenuList>
                                {dates.map((date, index) => (
                                    <MenuItem key={index} onClick={() => handleDateSelect(date)}>{date}</MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                        <Button rightIcon={<AddIcon />} colorScheme="teal" variant="outline" as={'a'} href={'/add-meal'}>
                            Add Meal
                        </Button>
                    </Stack>
                </Box>
                <Box bg="gray.200" p={4} ml="auto" mr={12} borderRadius="md">
                <Flex alignItems="center">
                    <Heading size="md" ml={5}>This Month</Heading>
                    <Spacer />
                    <Button colorScheme="teal" variant="outline" mr={4} onclick={setType('bulk')}>
                        Bulk
                    </Button>
                    <Button colorScheme="teal" variant="outline" onclick={setType('cut')}>
                        Cut
                    </Button>
                </Flex>
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Nutrients</Th>
                                    <Th isNumeric>Current</Th>
                                    <Th isNumeric>Target</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {calcData.map((item, index) => (
                                    <Tr key={index}>
                                        <Td>{item.nutrients}</Td>
                                        <Td isNumeric>{item.current}</Td>
                                        <Td isNumeric>{ type == 'bulk' ? item.bulk.target : item.cut.target}</Td>
                                        <Td>{ type == 'bulk' ? item.bulk.diff : item.cut.diff }</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                            <Tfoot>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
            </Flex>

            <TableContainer mt={10} mb={5}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Food</Th>
                            <Th isNumeric>Quantity</Th>
                            <Th isNumeric>Carbohydrates</Th>
                            <Th isNumeric>Protein</Th>
                            <Th isNumeric>Fats</Th>
                            <Th isNumeric>Calories</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {meals.map((item, index) => (
                            <Tr key={index}>
                                <Td>{item.foodname}</Td>
                                <Td isNumeric>{item.quantity}</Td>
                                <Td isNumeric>{item.carbs}</Td>
                                <Td isNumeric>{item.protein}</Td>
                                <Td isNumeric>{item.fat}</Td>
                                <Td isNumeric>{item.calories}</Td>
                                <Td>
                                    <Center>
                                        <EditIcon boxSize={5} mr={2} />
                                        <DeleteIcon boxSize={5} />
                                    </Center>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}
