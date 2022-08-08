import { Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useGame } from "../../context/GameContext";
import UserBox from "./UserBox";

const UserListSection = () => {
  const { users } = useGame();
  return (
    <Box
      bg="#EE4266"
      w={"25%"}
      borderTopLeftRadius={10}
      borderBottomLeftRadius={10}
      p={5}
      style={{ boxShadow: "rgba(100, 100, 111, 0.2) 10px 0px 25px 1px" }}
      zIndex={100}
    >
      <AnimatePresence>
        {users.map((user) => (
          <UserBox key={user} name={user} />
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default UserListSection;
