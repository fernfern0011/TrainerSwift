'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from "@chakra-ui/icons"
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button, Heading, IconButton, Input, Stack, Textarea, Image as ChakraImage, Box, Text
} from '@chakra-ui/react'
import React, { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"

export default function createNewPost() {
    const router = useRouter()
    const [file, setFile] = useState({})
    const [isUploading, setIsUploading] = useState(false)

    const setFileState = (data) => setFile((prev) => ({ ...prev, ...data }))

    const onDrop = (acceptedFiles) => {
        const fileObject = acceptedFiles[0]
        const preview = URL.createObjectURL(fileObject)

        setFileState({ fileObject, preview })

        const image = new Image()
        image.src = preview
        image.onload = () => setFileState({ width: image.width, height: image.height })

        const fileReader = new FileReader()
        fileReader.onabort = () => console.log('file reading was aborted')
        fileReader.onerror = () => console.log('file reading was failed')
        fileReader.readAsDataURL(fileObject)
        fileReader.onload = () => setFileState({ base64: fileReader.result })
    }

    // Yet to implement
    const handleSubmit = async () => {
        setIsUploading(true)

        try {
            const { base64, height, width } = file
            const url = '/'

            const { data } = await axios.post(url, { src: base64, height, width })
            console.log(data);
            setIsUploading(false)
        } catch (error) {
            console.log(error.response.data.message);
            setIsUploading(false)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        accept: 'image/*',
        onDrop,
    })

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
                <Heading ml={'30px'}>Create New Post</Heading>
            </Stack>
            <Stack direction={'row'} width={'100%'} p={'30px 90px'} gap={'10%'}>
                <Stack width={'50%'}>
                    <FormControl width={'100%'} justifyContent={'flex-start'}>
                        <FormLabel fontSize={'24px'}>Post Title <Text as='sup' color={'red'}>*</Text> </FormLabel>
                        <Input type='text' placeholder="Type a cool name..." mb={'20px'} />
                        <FormLabel fontSize={'24px'}>Content <Text as='sup' color={'red'}>*</Text> </FormLabel>
                        <Textarea type='text' placeholder="Type the description..." />
                    </FormControl>
                    <Button
                        colorScheme={'red'}
                        variant={'solid'}
                        mt={'50px'}
                        width={'fit-content'}
                        isDisabled={file.preview ? false : true}
                        // onClick={() => router.push('/post/create')}
                        onClick={() => alert('clicked')}>
                        Submit
                    </Button>
                </Stack>

                <Stack width={'50%'} flexDirection={'column'} justifyContent={'space-between'} >
                    <Box h={'75%'}>
                        <FormLabel fontSize={'24px'}>Image <Text as='sup' color={'red'}>*</Text> </FormLabel>

                        {/* Check if preview image is available */}
                        {file.preview ? (
                            <ChakraImage src={file.preview} alt='' boxSize={'350px'} w={'100%'} maxH={'inherit'} objectFit={'contain'} />
                        ) : (
                            <Box
                                display={'grid'}
                                placeItems={'center'}
                                minH={'75%'}
                                cursor={'pointer'}
                                border={'1px dashed black'}
                                overflow='hidden'
                                {...getRootProps()}>
                                <Input type="button" cursor={'pointer'} {...getInputProps()} />
                                <Text>
                                    {isDragActive ?
                                        "Release to drop the files here" :
                                        "Drag 'n' drop some files here, or click to select files"
                                    }
                                </Text>

                            </Box>
                        )}
                    </Box>
                    <Button
                        colorScheme={'gray'}
                        variant={'solid'}
                        width={'fit-content'}
                        isDisabled={file.preview ? false : true}
                        onClick={() => setFile({})}
                    >
                        Reset
                    </Button>
                </Stack>
            </Stack>
        </Stack>

    )
}