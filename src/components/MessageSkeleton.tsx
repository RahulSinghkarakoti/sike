import { Skeleton, SkeletonCircle, VStack, HStack, Box, Flex } from '@chakra-ui/react'

function MessageSkeleton() {
  return (
    
    <VStack spacing={6} align="stretch" w="100%" p={4}>
      {[1, 2, 3, 4, 5].map((i) => {
        const isEven = i % 2 === 0; // Simulate Sent (Right) vs Received (Left)

        return (
          <Flex
            key={i} 
            flexDir={isEven ? "row-reverse" : "row"} 
            align="end"
          >
            {/* Avatar - Only show for received messages or swap side for sent */}
            {!isEven && <SkeletonCircle size="8" mr={2} />}
            
            <Box 
              maxW="70%" 
              w="100%" 
              display="flex" 
              flexDir="column" 
              alignItems={isEven ? "flex-end" : "flex-start"}
            >
              {/* Message Bubble Skeleton */}
              <Skeleton 
                height="40px" 
                width={isEven ? "80%" : "100%"} 
                borderRadius="lg" 
                borderBottomRightRadius={isEven ? "none" : "lg"}
                borderBottomLeftRadius={isEven ? "lg" : "none"}
                mb={1}
              />
              
              {/* Timestamp Skeleton */}
              <Skeleton height="8px" width="30px" />
            </Box>
            
            {/* {isEven && <SkeletonCircle size="8" ml={2} />} */}
          </Flex>
        );
      })}
    </VStack>
  )
}

export default MessageSkeleton
