import { Skeleton, SkeletonCircle, VStack, HStack, Box } from '@chakra-ui/react'

function MessageSkeleton() {
  return (
    <VStack spacing={3} align="stretch">
      {[1, 2, 3, 4, 5].map((i) => (
        <HStack key={i} align="start">
          <SkeletonCircle size="8" />
          <Box flex="1">
            <Skeleton height="16px" mb={2} />
            <Skeleton height="12px" width="40%" />
          </Box>
        </HStack>
      ))}
    </VStack>
  )
}

export default MessageSkeleton
