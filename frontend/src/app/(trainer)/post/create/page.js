'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from "@chakra-ui/icons"
import {
    FormControl,
    FormLabel,
    Button, Heading, IconButton, Input, Stack, Textarea, Image as ChakraImage, Box, Text
} from '@chakra-ui/react'
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"

export default function CreateNewPost() {
    const router = useRouter()
    const [file, setFile] = useState({})
    const [error, setError] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        content: ''
    })

    const handleChange = (e) => {
        e.preventDefault();

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const setFileState = (data) => setFile((prev) => ({ ...prev, ...data }))

    const onDrop = (acceptedFiles) => {
        const fileObject = acceptedFiles[0]
        const preview = URL.createObjectURL(fileObject)

        setFileState({ fileObject, preview })
    }

    // Trigger s3 api and createNewPost api
    const handleSubmit = async () => {
        setIsUploading(true)
        setError("")

        if (formData.title != "" && formData.content != "") {

            try {

                // Upload Image to S3
                const uploadImage = new FormData();
                uploadImage.append("file", file.fileObject)
                const response = await fetch('/api/s3-upload', {
                    method: 'POST',
                    body: uploadImage
                })

                const data = await response.json();

                // If image successfully uploaded
                if (data.success == true) {
                    // To call createNewPost api
                    const createNewPost = await fetch('http://localhost:3000/api/post', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: formData.title,
                            description: formData.content,
                            category: "Test",
                            trainerid: "10"
                        })
                    })

                    // if post successfully created
                    const result = await createNewPost.json();
                    if (result.code == 201) {
                        setIsUploading(false)
                        setFile({})
                        setFormData({ title: "", content: "" })
                    }

                } else {
                    setIsUploading(false)
                }
            } catch (error) {
                console.log(error);
                setIsUploading(false)
            }
        } else {
            setIsUploading(false)
            setError('All required fields must not be empty')
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
                        <Input type='text' placeholder="Type a cool name..." mb={'20px'} name='title' value={formData.title} onChange={handleChange} required />
                        <FormLabel fontSize={'24px'}>Content <Text as='sup' color={'red'}>*</Text> </FormLabel>
                        <Textarea type='text' placeholder="Type the description..." name='content' value={formData.content} onChange={handleChange} required />
                    </FormControl>
                    <Button
                        colorScheme={'red'}
                        variant={'solid'}
                        mt={'50px'}
                        width={'fit-content'}
                        isLoading={isUploading ? true : false}
                        isDisabled={file.preview ? false : true}
                        loadingText='Submitting'
                        onClick={() => handleSubmit()}>
                        Submit
                    </Button>
                    {error ?
                        <Text color={"red"} mb={'10px'}>{error}</Text>
                        : ""}
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