import {
  Avatar,
  Center,
  Container,
  Flex,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const Test = () => {
  return (
    <Container>
      <Center height="100vh" p={10}>
        <VStack
          w={"100%"}
          bg="#65e495"
          h={"70%"}
          rounded="xl"
          p={3}
          shadow="lg"
        >
          <Text fontSize="3xl">Game Over</Text>
          <TableContainer w={"100%"}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th textAlign={"start"}>Name</Th>
                  <Th textAlign={"center"}>WPM</Th>
                  <Th textAlign={"end"}>Accuracy</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Someone</Td>
                  <Td textAlign={"center"}>20</Td>
                  <Td textAlign={"end"}>30%</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Center>
    </Container>
  );
};

export default Test;
