/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Input,
  Progress,
  Text,
} from "@chakra-ui/react";
import React, { memo, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import GameReady from "../components/Typing/GameReady";
import RaceProgress from "../components/Typing/RaceProgress";
import {
  GetReadyState,
  ListenToConfig,
  ListenToPlayerProgress,
  ListenToRaceEnd,
  ListenToReadyState,
  ReadyToPlay,
} from "../components/Typing/TyperRaceFunctions";
import Words from "../components/Typing/Words";
import {
  addCorrectWord,
  endrace,
  startrace,
  updateTime,
} from "../slices/Typing.slices";
import { socket } from "../utils/socket";
// const text: string[] = [
//   "this is a test quote for my typing game. Which will be really good and everybody will love this game. Which will be really good and everybody will love this game. Which will be really good and everybody will love this game.",
//   "The water rush down the wash and into the slot canyon below. Two hikers had started the day to sunny weather without a cloud in the sky, but they hadn't thought to check the weather north of the canyon. Huge thunderstorms had brought a deluge o rain and produced flash floods heading their way. The two hikers had no idea what was coming.",
//   "Wandering down the path to the pond had become a daily routine. Even when the weather wasn't cooperating like today with the wind and rain, Jerry still took the morning stroll down the path until he reached the pond. Although there didn't seem to be a particular reason Jerry did this to anyone looking in from the outside, those who knew him well knew exactly what was going on. It could all be traced back to a specific incident that happened exactly 5 years previously.",
//   "He couldn't move. His head throbbed and spun. He couldn't decide if it was the flu or the drinking last night. It was probably a combination of both.",
//   "Sleeping in his car was never the plan but sometimes things don't work out as planned. This had been his life for the last three months and he was just beginning to get used to it. He didn't actually enjoy it, but he had accepted it and come to terms with it. Or at least he thought he had. All that changed when he put the key into the ignition, turned it and the engine didn't make a sound.",
//   "Do you really listen when you are talking with someone? I have a friend who listens in an unforgiving way. She actually takes every word you say as being something important and when you have a friend that listens like that, words take on a whole new meaning.",
//   "He heard the crack echo in the late afternoon about a mile away. His heart started racing and he bolted into a full sprint. he repeated under his breathlessness as he continued to sprint.",
// ];

const TypeRace = () => {
  const dispatch = useAppDispatch();
  const { running, time, correctWords, correctLetterCount, gameTime, words } =
    useAppSelector((state) => state.typerace);
  const [typed, setTyped] = useState("");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [prevWordIdx, setPrevWordIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [corrects, setCorrects] = useState(0);
  const [wordHistory, setWordHistory] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [timeInSec, setTimeInSec] = useState<number>(0);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  const currentWordRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentLetterRef = useRef<HTMLSpanElement>(null);

  const resetClasses = (index: number) => {
    currentWordRef.current?.children[index].classList.remove(
      "correct",
      "incorrect",
      "skipped"
    );
  };
  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.key;
    const isSpace = e.code === "Space";
    // if (!running) {
    //   dispatch(startrace());
    // }
    if (input.length === 1 && !isSpace) {
      if (input === currentWord[typed.length]) {
        setCorrects((state) => state + 1);
        setTyped((state) => state + input);
        setPrevWordIdx(currentWordIdx);
        currentWordRef.current?.children[typed.length].classList.add("correct");
      } else if (typed.length < currentWord.length) {
        setTyped((state) => state + input);
        setMistakes((state) => state + 1);
        currentWordRef.current?.children[typed.length].classList.add(
          "incorrect"
        );
      } else {
        setMistakes((state) => state + 1);
      }
    }
    if (input === " " && typed.length !== 0) {
      if (typed.length !== currentWord.length) {
        currentWordRef.current?.classList.add("mistake");
        const childs = currentWordRef.current?.children;
        if (childs) {
          for (let i = 0; i < childs.length; i++) {
            if (childs[i].classList.length <= 1) {
              childs[i].classList.add("skipped");
            }
          }
        }
      }
      if (typed === currentWord) {
        dispatch(addCorrectWord({ word: typed, index: currentWordIdx }));
      }
      setWordHistory((state) => {
        const temp = state;
        temp[currentWordIdx] = typed;
        return temp;
      });
      setCurrentWordIdx((current) => current + 1);
      setPrevWordIdx(currentWordIdx + 1);
      setCurrentWord(words[currentWordIdx + 1]);
      setTyped("");
      setProgress(progress);
    }
    if (input === "Backspace") {
      handleBackspace();
    }
  };
  const handleBackspace = () => {
    if (typed.length === 0 && currentWordIdx === 0) {
      return;
    }
    //backing current word
    if (typed.length > 0) {
      resetClasses(typed.length - 1);
      setPrevWordIdx(currentWordIdx);
      setTyped((state) => state.slice(0, -1));
    }

    //?Back to previous word
    if (typed.length === 0 && currentWordIdx !== 0) {
      const childs = currentWordRef.current?.previousElementSibling?.children;
      let hasMistake = false;
      if (childs) {
        for (let i = 0; i < childs.length; i++) {
          (childs[i].classList.contains("skipped") ||
            childs[i].classList.contains("incorrect")) &&
            (hasMistake = true);
        }
      }
      if (hasMistake) {
        setCurrentWordIdx((state) => state - 1);
        setCurrentWord(words[currentWordIdx - 1]);
        setTyped(wordHistory[currentWordIdx - 1]);
      }
    }
  };

  const handleTimeout = () => {
    if (inputRef.current) {
      dispatch(endrace());
      // inputRef.current.disabled = true;
      console.log("over");
      if (caretRef.current && currentLetterRef.current) {
        caretRef.current.style.top =
          currentLetterRef?.current?.getBoundingClientRect().top -
          currentLetterRef.current.clientHeight / 4 -
          20 +
          "px";
      }
    }
  };

  useEffect(() => {
    if (caretRef.current && currentLetterRef.current) {
      caretRef.current.style.top =
        currentLetterRef?.current?.getBoundingClientRect().top -
        currentLetterRef.current.clientHeight / 4 +
        4 +
        "px";
      if (typed.length === 0) {
        console.log("normal");
        caretRef.current.style.left =
          currentLetterRef?.current?.getBoundingClientRect().left -
          currentLetterRef.current.clientWidth -
          2 +
          "px";
      } else {
        caretRef.current.style.left =
          currentLetterRef?.current?.getBoundingClientRect().left +
          currentLetterRef.current.offsetWidth +
          "px";
      }
    }
  }, [
    typed,
    currentWordIdx,
    words,
    wordHistory,
    currentLetterRef,
    prevWordIdx,
  ]);
  useEffect(() => {
    if (words.length !== 0) {
      setCurrentWord(words[0]);
      inputRef.current?.focus();
    }
  }, [words]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (running) {
      interval = setInterval(() => {
        setTimeInSec((val) => {
          dispatch(updateTime(val + 1));
          return val + 1;
        });
        if (!running) {
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [running]);

  useEffect(() => {
    if (time >= gameTime) {
      handleTimeout();
    }
  }, [time, running]);

  useEffect(() => {
    let progress = (wordHistory.length / words.length) * 100;
    socket.emit("typerace_progress", {
      progress,
    });
    console.log(progress);
  }, [wordHistory.length]);

  //Multiplayer related stuffs
  useEffect(() => {
    ListenToRaceEnd(dispatch);
    ListenToConfig(dispatch);
    ListenToPlayerProgress(dispatch);
  }, []);

  return (
    <Center
      height={"100vh"}
      bg="#262626"
      display={"flex"}
      flexDirection={"column"}
    >
      <Button onClick={() => setShowDebug((val) => !val)} size="sm" mb={5}>
        Toggle Debug
      </Button>

      <Container maxW="5xl">
        <RaceProgress />
        <Progress
          value={progress}
          size="sm"
          borderRadius={20}
          color="#65e495"
        />
        <HStack spacing={5} alignItems="end" mb={5}>
          <Text color="white">
            <span style={{ fontSize: "2rem" }}>{timeInSec}</span>/{gameTime} sec
          </Text>
          <Text color="white">
            {Math.round((correctLetterCount * (60 / gameTime)) / 5)} WPM
          </Text>
          <Text color="white">
            {isFinite(
              Math.round(
                ((correctLetterCount - mistakes) / correctLetterCount) * 100
              )
            )
              ? Math.round(
                  ((correctLetterCount - mistakes) / correctLetterCount) * 100
                )
              : 0}
            {"% "}
            Accuracy
          </Text>
        </HStack>
      </Container>
      <Container maxW="5xl" h={100}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {
            <Words
              word={words}
              currentLetterRef={currentLetterRef}
              currentWord={currentWord}
              currentWordIdx={currentWordIdx}
              currentWordRef={currentWordRef}
              typed={typed}
            />
          }
          <div
            className={`caret ${!running && time > 0 ? "carret-end" : ""}`}
            ref={caretRef}
          ></div>
          <Input
            autoFocus
            onKeyDown={handleTyping}
            value={typed}
            hidden={!running && time > 0}
            opacity={0}
            ref={inputRef}
          />
          {showDebug && (
            <pre style={{ position: "absolute", right: 50, top: 50 }}>
              {JSON.stringify(
                {
                  typed,
                  correctLetterCount,
                  typedLength: typed.length,
                  current: currentWord[typed.length],
                  currentWord,
                  currentWordIdx,
                  prevWordIdx,
                  mistakes,
                  correctWords,
                  currentLetter: {
                    classes: currentLetterRef.current?.classList,
                    text: currentLetterRef.current?.textContent,
                  },
                  wordHistory,
                },
                null,
                2
              )}
            </pre>
          )}
        </div>
      </Container>
      {!running && <GameReady />}
    </Center>
  );
};

export default TypeRace;
