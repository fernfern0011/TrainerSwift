"use client"
import { Heading, Spacer, Box, Flex, Button, Menu, MenuButton, MenuList, MenuItem, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Tfoot, Stack } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { React, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DietPage() {
    const [meals, setMeals] = useState([]);
    const [calcData, setCalcData] = useState([]);
    const [type, setType] = useState('bulk');
    const [checkToken, setCheckToken] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token')
        const trainerinfo = Cookies.get('trainerinfo')
        var trainerid

        if (!token) {
            router.replace('/') // If no token is found, redirect to login page
            return
        }

        if (!(trainerinfo === undefined)) {
            trainerid = JSON.parse(trainerinfo)
        }

        setCheckToken(token)
        const fetchMeals = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/diet/7', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch meals');
                }
                const data = await response.json();
                if (data.data == undefined) {
                    setMeals(data.message);
                } else {
                    setMeals(data.data.meal);
                }

            } catch (error) {
                console.error('Error fetching meals:', error);
            }

            try {
                const response = await fetch('http://localhost:3000/api/calculator/7', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch calculator data');
                }
                const data = await response.json();
                setCalcData(data.data);
            } catch (error) {
                console.error('Error fetching calculator data:', error);
            }
        };

        fetchMeals();
    }, []);

    const handleTypeSelect = (type) => {
        setType(type);
    };

    return (
        <Box>
            <Flex alignItems="center" mt={5}>
                <Box bg="gray.200" pl={20} ml={5} height="325px" width="700px">
                    <Heading mt={20} mb={10} size='3xl'>Trainee 7 Diet</Heading>
                </Box>
                <Box bg="gray.200" p={4} ml="auto" mr={12} borderRadius="md">
                    <Flex alignItems="center">
                        <Heading size="md" ml={5}>This Month</Heading>
                        <Spacer />
                        <Button colorScheme="teal" variant="outline" mr={4} onClick={() => handleTypeSelect('bulk')}>
                            Bulk
                        </Button>
                        <Button colorScheme="teal" variant="outline" onClick={() => handleTypeSelect('cut')}>
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
                                        <Td isNumeric>{type == 'bulk' ? item.target.bulk : item.target.cut}</Td>
                                        <Td>{type == 'bulk' ? item.diff.bulk : item.diff.cut}</Td>
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
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}
