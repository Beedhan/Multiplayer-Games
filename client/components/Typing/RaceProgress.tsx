import { Avatar, HStack } from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "../../app/hooks";

const RaceProgress = () => {
  const { raceProgress } = useAppSelector((state) => state.typerace);
  return (
    <HStack
      width="100%"
      rounded={"xl"}
      height={2}
      bg={"green.500"}
      position="relative"
      marginBottom={5}
    >
      {raceProgress &&
        raceProgress.map((e) => (
          <>
            {Object.values(e).map((user) => (
              <Avatar
                key={user.name}
                name={user.name}
                transition="all"
                position={"absolute"}
                left={`${user.progress}%`}
                size="sm"
              />
            ))}
          </>
        ))}
    </HStack>
  );
};

export default RaceProgress;
