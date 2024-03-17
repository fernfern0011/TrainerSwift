'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from "@chakra-ui/icons"
import {
    FormControl,
    FormLabel,
    Select,
    Flex,
    Tag,
    TagLabel,
    TagCloseButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Button, Heading, IconButton, Input, Stack, Text, HStack
} from '@chakra-ui/react'
import React, { useState, useEffect } from "react"

export default function CreateNewPackage() {
    const router = useRouter()
    const [isModeSelected, setIsModeSelected] = useState('')
    const [timeValue, setTimeValue] = useState('')
    const [timeList, setTimeList] = useState([])
    const [filterTimeList, setFilterTimeList] = useState([])
    const [priceValue, setPriceValue] = useState(0)
    const [error, setError] = useState('')

    const handleSubmitTimeslot = () => {
        if (timeValue != '') {
            if (!timeList.includes(timeValue) && timeList.length < 10) {
                const newTimeslot = timeList.concat(timeValue);
                setTimeList(newTimeslot);
                setError('')
            } else if (timeList.length >= 10) {
                console.log(timeList);
                setError('Timeslot can\'t exceed 10 slots.')
            } else {
                setError('Timeslot already exists.')
            }
        }
        else {
            setError('Timeslot is required.')
        }
    }

    const handleRemoveTimeslot = (time) => {
        // find whether the timeslot exists
        const removeIndex = timeList.indexOf(time);

        // only splice array when item is found
        if (removeIndex > -1) {
            // store existing timelist to a new variable
            // and splice from that new variable
            // after that store into the timelist
            const updatedTimeList = [...timeList];
            updatedTimeList.splice(removeIndex, 1);
            setTimeList(updatedTimeList)
        }
    }

    // whenever the timelist changes, filtertimelist gets updated
    useEffect(() => {
        setFilterTimeList(timeList)
    }, [timeList]);

    const handlePriceChange = (value) => {
        console.log(value);
        setPriceValue(value)
    }

    return (
        <Stack direction='column' m={'30px 50px'}>
            <Stack direction='row' align={'center'}>
                <IconButton
                    isRound={true}
                    variant='solid'
                    colorScheme='teal'
                    aria-label='Done'
                    fontSize='36px'
                    icon={<ChevronLeftIcon />}
                    onClick={() => router.push('/post')}
                />
                <Heading ml={'30px'}>Create New Package</Heading>
            </Stack>
            <Stack p={'30px 90px'}>
                <FormControl width={'100%'} justifyContent={'flex-start'}>
                    <FormControl>
                        <FormLabel fontSize={'24px'}>Package Name<Text as='sup' color={'red'}>*</Text> </FormLabel>
                        <Input type='text' placeholder="Type a cool name..." mb={'20px'} />
                    </FormControl>

                    <Flex mb={'20px'} >
                        <FormControl mr='5%'>
                            <FormLabel fontSize={'24px'}>Day <Text as='sup' color={'red'}>*</Text> </FormLabel>
                            <Select placeholder='Select day'>
                                <option value='mon'>Monday</option>
                                <option value='tues'>Tuesday</option>
                                <option value='wed'>Wednesday</option>
                                <option value='thurs'>Thursday</option>
                                <option value='fri'>Friday</option>
                                <option value='sat'>Saturday</option>
                                <option value='sun'>Sunday</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize={'24px'}>Mode <Text as='sup' color={'red'}>*</Text> </FormLabel>
                            <Select placeholder='Select mode' onChange={(e) => setIsModeSelected(e.target.value)}>
                                <option value='offline'>Offline</option>
                                <option value='online'>Online</option>
                            </Select>
                        </FormControl>
                    </Flex>

                    {/* If Offline mode is selected, address field is shown */}
                    <FormControl hidden={isModeSelected == 'offline' ? false : true}>
                        <FormLabel fontSize={'24px'}>Address<Text as='sup' color={'red'}>*</Text> </FormLabel>
                        <Input type='text' placeholder="Type your address..." mb={'20px'} />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'24px'}>Timeslot<Text as='sup' color={'red'}>*</Text> </FormLabel>
                        <Input id='time' type='time' width={'50%'} mb={'20px'} mr={'20px'} onChange={(e) => setTimeValue(e.target.value)} />
                        <Button
                            colorScheme='teal'
                            variant={'solid'}
                            onClick={() => handleSubmitTimeslot()}
                        >
                            Add
                        </Button>
                    </FormControl>

                    <FormControl mb={'20px'} >
                        {error ?
                            <Text color={"red"} mb={'10px'}>{error}</Text>
                            : ""}
                        <HStack spacing={4}>
                            {filterTimeList.map((time) => (
                                <Tag
                                    size={'md'}
                                    key={time}
                                    variant='outline'
                                    colorScheme='blue'
                                >
                                    <TagLabel>{time}</TagLabel>
                                    <TagCloseButton onClick={() => handleRemoveTimeslot(time)} />
                                </Tag>
                            ))}
                        </HStack>
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'24px'}>Price (SGD) <Text as='sup' color={'red'}>*</Text> </FormLabel>
                        <Flex>
                            <NumberInput maxW='100px' mr='2rem' value={priceValue} onChange={handlePriceChange}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Slider
                                flex='1'
                                focusThumbOnChange={false}
                                value={priceValue}
                                onChange={handlePriceChange}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb fontSize='sm' boxSize='32px' children={priceValue} />
                            </Slider>
                        </Flex>
                    </FormControl>
                </FormControl>

                <Button
                    colorScheme={'red'}
                    variant={'solid'}
                    mt={'50px'}
                    width={'fit-content'}
                    // isDisabled={file.preview ? false : true}
                    // onClick={() => router.push('/post/create')}
                    onClick={() => alert('clicked')}>
                    Submit
                </Button>
            </Stack >
        </Stack >

    )
}