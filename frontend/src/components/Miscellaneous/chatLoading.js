import React from 'react'
import { Stack } from '@chakra-ui/react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

const chatLoading = () => {
    return (
        <Stack>
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />

        </Stack>
    )
}

export default chatLoading