"use client"
import { Heading, Spacer, Box, Flex, Button, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Tfoot, Center} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { React, useState, useEffect } from 'react';

export default function DietPage() {
    const [meals, setMeals] = useState([]);
    const [calcData, setCalcData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [type, setType] = useState('bulk');

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/diet/7');
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
                const response = await fetch('http://localhost:3000/api/calculator/7');
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
    }, [refresh]);

    const handleTypeSelect = (type) => {
        setType(type);
    };

    const deleteMeal = async (mealid) => {
        
        const deleteData = {
            mealid: mealid,
        };

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteData)
        };

        try {
            const response = await fetch(`http://localhost:3000/api/diet/7/${mealid}`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to delete meal');
            }
            const data = await response.json();
            console.log(data)
            sessionStorage.setItem('calcData', JSON.stringify(data));
            setRefresh(prevRefresh => !prevRefresh);
        } catch (error) {
            console.error('Error deleting meals:', error);
        }        
    }

    return (
        <Box>
            <Flex alignItems="center" mt={5}>
                <Box bg="gray.200" pl={20} ml={5} height="325px" width="700px">
                    <Heading mt={20} mb={10} size='3xl'>My Diet</Heading>
                    <Button rightIcon={<AddIcon />} colorScheme="teal" variant="outline" as={'a'} href={'/add-meal'}>
                        Add Meal
                    </Button>
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
                                        <Td isNumeric>{ type == 'bulk' ? item.target.bulk : item.target.cut}</Td>
                                        <Td>{ type == 'bulk' ? item.diff.bulk : item.diff.cut }</Td>
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
                                    <Center display={item.foodname=="No Data" ? "none" : "block"}>
                                        <Button colorScheme="teal" variant="outline" as={'a'} href={`/update-meal?mealid=${item.mealid}&foodname=${item.foodname}&quantity=${item.quantity}`} mr="3%">
                                            <EditIcon boxSize={5} />
                                        </Button>
                                        <Button colorScheme="teal" variant="outline" onClick={() => deleteMeal(item.mealid) }>
                                            <DeleteIcon boxSize={5} />
                                        </Button>
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
