import { Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import UserBox from "./UserBox";

const UserListSection = () => {
  const { users } = useAppSelector((state) => state.game);
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
      <AnimatePresence exitBeforeEnter>
        {users.map((user, index) => (
          <UserBox key={`${user}-${index}`} name={user} />
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default UserListSection;
