'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeftIcon } from "@chakra-ui/icons"
import {
    FormControl,
    FormLabel,
    Button, Heading, IconButton, Input, Stack, Textarea, Image as ChakraImage, Box, Text, useToast
} from '@chakra-ui/react'
import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Cookies from 'js-cookie'

export default function PostEditPage({ params }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState({})
    const [error, setError] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const toast = useToast()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        trainerid: 0
    })

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

        setLoading(true)
        const fetchData = async () => {
            const getPostRes = await fetch(`http://localhost:3000/api/post/${params.postid}?trainerid=${trainerid.trainerid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            // if post successfully fetched
            const result = await getPostRes.json()
            const postInfo = result.data.post

            if (result.code == 200) {
                setFormData({
                    title: postInfo.title,
                    description: postInfo.description,
                    category: postInfo.category,
                    trainerid: trainerid.trainerid
                })

                setFile({ preview: postInfo.image })

                setLoading(false)
            } else if (result.code == 400) {
                setError('There is no post.')
                setLoading(false)
            }
            else {
                setError('Failed to retrieve post data.')
                setLoading(false)
            }
        }

        fetchData().catch((e) => {
            // handle the error as needed
            console.error('An error occurred while fetching the data: ', e)
        })
    }, [])

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
    const handleUpdate = async () => {
        setIsUploading(true)
        setError("")

        if (formData.title != "" && formData.description != "" && formData.category != "") {

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
                    const s3ObjectURL = 'https://trainerswift-web-storage.s3.ap-southeast-1.amazonaws.com/post/'

                    // To call updatePost api
                    const updatePost = await fetch('http://localhost:3000/api/post', {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: formData.title,
                            description: formData.description,
                            category: formData.category,
                            trainerid: formData.trainerid,
                            image: s3ObjectURL + data.fileName,
                            postid: params.postid
                        })
                    })

                    // if post successfully created
                    const result = await updatePost.json();
                    if (result.code == 200) {
                        setIsUploading(false)
                        setFile({})
                        setFormData({ title: "", description: "", category: "" })

                        // when updated successfully
                        toast({
                            title: 'Post updated successfully.',
                            status: 'success',
                            position: 'top-right',
                            duration: 5000,
                            isClosable: true,
                        })

                        router.push('/post')
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
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': []
        },
        onDrop,
    })

    return (
        <Stack direction='column' m={'30px 50px'}>
            {loading ?
                <Text width={'fit-content'} m={'auto'} pt={'50px'}>Retriving post data...</Text> : (
                    <Stack minH={'83.5vh'}>
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
                            <Heading ml={'30px'}>Edit {formData.title} Post</Heading>
                        </Stack>

                        <Stack direction={'row'} width={'100%'} p={'30px 90px'} gap={'10%'}>
                            <Stack width={'50%'}>
                                <FormControl width={'100%'} justifyContent={'flex-start'}>
                                    <FormLabel fontSize={'24px'}>Post Title <Text as='sup' color={'red'}>*</Text> </FormLabel>
                                    <Input type='text' placeholder="Type a cool name..." mb={'20px'} name='title' value={formData.title} onChange={handleChange} required />
                                    <FormLabel fontSize={'24px'}>Description <Text as='sup' color={'red'}>*</Text> </FormLabel>
                                    <Textarea type='text' placeholder="Type the description..." mb={'20px'} name='description' value={formData.description} onChange={handleChange} required />
                                    <FormLabel fontSize={'24px'}>Category <Text as='sup' color={'red'}>*</Text> </FormLabel>
                                    <Input type='text' placeholder="Type a category..." mb={'20px'} name='category' value={formData.category} onChange={handleChange} required />
                                </FormControl>
                                <Button
                                    colorScheme={'red'}
                                    variant={'solid'}
                                    mt={'50px'}
                                    width={'fit-content'}
                                    isLoading={isUploading ? true : false}
                                    isDisabled={file.preview ? false : true}
                                    loadingText='Submitting'
                                    onClick={() => handleUpdate()}>
                                    Update
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
                                            <Text textAlign={'center'}>
                                                {isDragActive ?
                                                    "Release to drop the files here" :
                                                    `Drag 'n' drop some files here, or click to select files.
                                        (Only *.jpeg and *.png images will be accepted)
                                        suggested size 200x200`
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
                )}
        </Stack>
    )
}