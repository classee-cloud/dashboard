import React from 'react'
import ProfilePhoto from './ProfilePhoto'
import {  Box, VStack, Text, HStack } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useDashboardController } from '../../classes/DashboardController';

export default function Profile(){
    const dashboardController = useDashboardController();
    return (
        <HStack>
            <ProfilePhoto />
            <VStack
                display={{ base: 'none', md: 'flex' }}
                alignItems="flex-start"
                spacing="1px"
                ml="2">
                <Text fontSize="sm">{dashboardController.usersName}</Text>
            </VStack>
            <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown />
            </Box>
        </HStack>
    )
}
