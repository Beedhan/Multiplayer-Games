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
            {Object.keys(e).map((name) => (
              <Avatar
                key={name}
                name={name}
                transition="all"
                position={"absolute"}
                left={`${e[name]}%`}
                size="sm"
              />
            ))}
          </>
        ))}
    </HStack>
  );
};

export default RaceProgress;
