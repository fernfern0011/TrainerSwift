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

function convertTimeIntoInt(starttime, endtime) {
    const intStartTime = parseInt(starttime.replace(":", ""))
    const intEndTime = parseInt(endtime.replace(":", ""))

    return [intStartTime, intEndTime]
}

export default function CreateNewPackage() {
    const router = useRouter()
    const [isModeSelected, setIsModeSelected] = useState('')
    const [timeList, setTimeList] = useState([])
    const [filterTimeList, setFilterTimeList] = useState([])
    const [error, setError] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        day: '',
        mode: '',
        address: '',
        price: 0
    })

    const [timeValue, setTimeValue] = useState({
        starttime: '',
        endtime: ''
    })

    const handleTimeslot = (e) => {
        setError('')

        const { name, value } = e.target;
        setTimeValue({
            ...timeValue,
            [name]: value
        })
    }

    const handleChange = (e) => {
        setError('')

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })

        if (name == "mode") {
            setIsModeSelected(value)
        }
    }

    const handleSubmitTimeslot = () => {
        console.log(timeValue, error);

        if (timeValue.starttime != '' && timeValue.endtime != '') {
            var selectedTime;
            var isInvalid = false;
            console.log("not error", error);

            // Check if the time list has any value
            if (timeList.length > 0) {
                console.log("yes more than 1");

                timeList.forEach(time => {
                    // Convert time into int
                    const checkStartTime = time.split(" - ")[0]
                    const checkEndTime = time.split(" - ")[1]
                    const intTimeArray = convertTimeIntoInt(checkStartTime, checkEndTime)
                    console.log(intTimeArray);

                    // Check whether the start time overlaps
                    const checkNewStartTime = parseInt(timeValue.starttime.replace(":", ""))
                    const checkNewEndTime = parseInt(timeValue.endtime.replace(":", ""))
                    console.log(checkNewStartTime, checkNewEndTime);

                    if (checkNewStartTime >= intTimeArray[0] && checkNewStartTime <= intTimeArray[1]
                        || checkNewEndTime >= intTimeArray[0] && checkNewEndTime <= intTimeArray[1]) {
                        console.log("in between");
                        isInvalid = true
                        setError('Timeslot should not overlap.')
                    } else if (checkNewStartTime > checkNewEndTime) {
                        console.log("invalid");
                        isInvalid = true
                        setError('Invalid timeslot.')
                    }
                    else {
                        console.log('no');
                        selectedTime = timeValue.starttime + ' - ' + timeValue.endtime
                    }
                })
            } else if (timeList.length == 0) {
                const intTimeArray = convertTimeIntoInt(timeValue.starttime, timeValue.endtime)

                // If starttime is less than endtime
                if (intTimeArray[0] < intTimeArray[1]) {
                    selectedTime = timeValue.starttime + ' - ' + timeValue.endtime
                } else {
                    isInvalid = true
                    setError('Invalid timeslot.')
                }
            }

            // Check whether there is error for starttime overlapping
            if (!isInvalid) {
                console.log("enter");
                if (!timeList.includes(selectedTime) && timeList.length < 10) {
                    const newTimeslot = timeList.concat(selectedTime);
                    setTimeList(newTimeslot);
                    setError('')
                } else if (timeList.length >= 10) {
                    setError('Timeslot can\'t exceed 10 slots.')
                }
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

    // Trigger createNewPackage api and craeteNewAvailability api
    const handleSubmit = async () => {
        setIsUploading(true)
        setError("")

        if (formData.title != '' && formData.day != '' && formData.price != 0 && timeList.length != 0) {
            if (formData.mode == "offline") {

            }

        }
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
                        <Input type='text' name='title' placeholder="Type a cool name..." mb={'20px'} onChange={(e) => handleChange(e)} />
                    </FormControl>

                    <Flex mb={'20px'} >
                        <FormControl mr='5%'>
                            <FormLabel fontSize={'24px'}>Day <Text as='sup' color={'red'}>*</Text> </FormLabel>
                            <Select placeholder='Select day' name='day' onChange={(e) => handleChange(e)}>
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
                            <Select placeholder='Select mode' name='mode' onChange={(e) => handleChange(e)}>
                                <option value='offline'>Offline</option>
                                <option value='online'>Online</option>
                            </Select>
                        </FormControl>
                    </Flex>

                    {/* If Offline mode is selected, address field is shown */}
                    <FormControl hidden={isModeSelected == 'offline' ? false : true}>
                        <FormLabel fontSize={'24px'}>Address<Text as='sup' color={'red'}>*</Text> </FormLabel>
                        <Input type='text' name='address' placeholder="Type your address..." mb={'20px'} onChange={(e) => handleChange(e)} />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'24px'}>Timeslot<Text as='sup' color={'red'}>*</Text></FormLabel>
                        <Stack direction='row' align={'center'}>
                            <Stack direction='row' width={'50%'}>
                                <Stack direction='column' width={'100%'}>
                                    <Text mb='8px' width={'100%'}>Start time:</Text>
                                    <Input name='starttime' type='time' width={'100%'} mb={'20px'} mr={'20px'} onChange={(e) => handleTimeslot(e)} />
                                </Stack>
                                <Stack direction='column' width={'100%'}>
                                    <Text mb='8px' width={'100%'}>End time:</Text>
                                    <Input name='endtime' type='time' width={'100%'} mb={'20px'} mr={'20px'} onChange={(e) => handleTimeslot(e)} />
                                </Stack>
                            </Stack>
                            <Button
                                colorScheme='teal'
                                variant={'solid'}
                                mt={'20px'}
                                onClick={() => handleSubmitTimeslot()}
                            >
                                Add
                            </Button>
                        </Stack>
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
                            <NumberInput maxW='100px' mr='2rem' name='price' value={formData.price}
                                onChange={(value) => handleChange({ target: { name: 'price', value } })}
                                max={1000}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Slider
                                flex='1'
                                focusThumbOnChange={false}
                                value={formData.price}
                                max={1000}
                                onChange={(value) => handleChange({ target: { name: 'price', value } })}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb fontSize='sm' boxSize='32px' children={formData.price} />
                            </Slider>
                        </Flex>
                    </FormControl>
                </FormControl>

                <Button
                    colorScheme={'red'}
                    variant={'solid'}
                    mt={'50px'}
                    width={'fit-content'}
                    isLoading={isUploading ? true : false}
                    isDisabled={(formData.title != '' && formData.day != '' && formData.mode != '' && formData.price != 0 && timeList.length != 0) ? false : true}
                    loadingText='Submitting'
                    onClick={() => handleSubmit()}>
                    Submit
                </Button>
            </Stack >
        </Stack >

    )
}