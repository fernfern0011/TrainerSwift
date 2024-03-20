"use client"
import { AddIcon } from '@chakra-ui/icons'
import { Button, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
export default function Post() {
    const router = useRouter()

    return (
        <Stack direction='row' spacing={15} margin={20}>
            <Button
                rightIcon={<AddIcon />}
                colorScheme={'blue'}
                variant={'solid'}
                borderRadius={'50px'}
                onClick={() => router.push('/package/create')}>
                Create Package
            </Button>
        </Stack>
    )
}
