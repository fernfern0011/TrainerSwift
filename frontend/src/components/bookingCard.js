'use client'

import React, { useEffect, useState } from 'react'
import {
    Flex,
    Box,
    useColorModeValue,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button,
    Spinner,
    UnorderedList,
    ListItem,
    Text,
    Tag,
    TagLabel, Stack
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { ArrowForwardIcon } from '@chakra-ui/icons'

export default function BookingCard({ packageid, ispremium, name, day, mode, detail, address, price, timeslots, trainerid }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [booking, setBooking] = useState(false)
    const [checkToken, setCheckToken] = useState('')
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        traineeID: 0,
        trainerID: 0,
        packageID: 0,
        availabilityID: 0,
        ispremium: false
    })

    useEffect(() => {
        const token = Cookies.get('token')
        const traineeinfo = Cookies.get('traineeinfo')
        var traineeid

        if (!token) {
            router.replace('/') // If no token is found, redirect to login page
            return
        }

        if (!(traineeinfo === undefined)) {
            traineeid = JSON.parse(traineeinfo)
            setFormData({
                traineeID: traineeid.traineeid,
                trainerID: trainerid,
                packageID: packageid,
                availabilityID: 0,
                ispremium: ispremium
            })
        }

        setCheckToken(token)
    }, [])


    const handleSelectTimeslot = async (e) => {
        setFormData({
            ...formData,
            availabilityID: parseInt(e.target.id)
        })
    }

    const handleSubmitTimeslot = async (e) => {
        setBooking(true)
        console.log(formData);

        if (formData.availabilityID == 0) {
            setError('Timeslot must be selected')
        }

        const triggerPayment = await fetch('http://localhost:3000/api/payment', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${checkToken}`,
            },
            body: JSON.stringify(formData)
        })

        // trigger payment
        const result = await triggerPayment.json()
        console.log(result);

        // setLoading(true)
    }

    return (
        <Flex w={"full"} justifyContent={'space-around'}>
            {loading ? <Spinner m={'auto'} /> :
                <Box
                    bg={useColorModeValue('white', 'gray.800')}
                    w={'100%'}
                    borderWidth="1px"
                    rounded="lg"
                    shadow="lg"
                    position="relative">
                    <Box>
                        <Flex direction={'column'} p={"6"} bgColor={'gray.50'} minH={'210px'}>
                            <Flex mt="1">
                                <Box
                                    mr={'10px'}
                                    fontSize="24px"
                                    fontWeight="semibold"
                                    lineHeight="tight"
                                    isTruncated>
                                    {name}
                                </Box>
                                {ispremium ? (<Tag
                                    size={'md'}
                                    maxWidth={'fit-content'}
                                    colorScheme='yellow'
                                >
                                    <TagLabel>Premium</TagLabel>
                                </Tag>) : ''}
                            </Flex>

                            {/* Package Details */}
                            <Flex justifyContent="space-between">
                                <UnorderedList>
                                    <ListItem><b>Day:</b> {day ? day : 'To Be Updated'}</ListItem>
                                    <ListItem><b>Mode:</b> {mode}</ListItem>
                                    {mode == 'offline' ? (<ListItem><b>Location:</b> {address ? address : 'To Be Updated'}</ListItem>) : ""}
                                    <ListItem><b>Detail:</b> {detail}</ListItem>
                                </UnorderedList>
                                <Box fontSize="22px" ml={25}>
                                    ${price}
                                </Box>
                            </Flex>
                        </Flex>

                        <Stack>
                            {/* Package timeslots */}
                            {timeslots.length != 0 ? (
                                <Accordion allowMultiple>
                                    <AccordionItem>
                                        <AccordionButton>
                                            <Text mb={'5px'}>Timeslots Available:</Text>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            {(timeslots).sort(function (a, timeslot) { return a.availabilityid - timeslot.availabilityid }).map((timeslot) =>
                                            (
                                                <Button
                                                    variant={timeslot.availabilityid == formData.availabilityID ? 'solid' : 'outline'}
                                                    colorScheme={timeslot.availabilityid == formData.availabilityID ? 'blue' : 'blue'}
                                                    mr={2} mb={2} id={timeslot.availabilityid}
                                                    key={timeslot.availabilityid}
                                                    onClick={(e) => handleSelectTimeslot(e)}>
                                                    {timeslot.time}
                                                </Button>
                                            )
                                            )}
                                            {error &&
                                                <Text color={"red"} width={'fit-content'} m={'auto'}>{error}</Text>
                                            }
                                            <Button
                                                colorScheme='red'
                                                variant={'solid'}
                                                w={'full'}
                                                mt={'10px'}
                                                rightIcon={<ArrowForwardIcon />}
                                                isLoading={booking ? true : false}
                                                isDisabled={formData.availabilityID ? false : true}
                                                onClick={() => handleSubmitTimeslot()}
                                            >
                                                Book a slot
                                            </Button>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            ) :
                                (<Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>No timeslots</Text>)}
                        </Stack>
                    </Box>
                </Box>
            }
        </Flex>
    )
}