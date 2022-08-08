/* eslint-disable react-hooks/exhaustive-deps */
import { Center, Container, Input } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
const text: string[] = [
  "this is a test quote for my typing game. Which will be really good and everybody will love this game. Which will be really good and everybody will love this game. Which will be really good and everybody will love this game.",
  "The water rush down the wash and into the slot canyon below. Two hikers had started the day to sunny weather without a cloud in the sky, but they hadn't thought to check the weather north of the canyon. Huge thunderstorms had brought a deluge o rain and produced flash floods heading their way. The two hikers had no idea what was coming.",
  "Wandering down the path to the pond had become a daily routine. Even when the weather wasn't cooperating like today with the wind and rain, Jerry still took the morning stroll down the path until he reached the pond. Although there didn't seem to be a particular reason Jerry did this to anyone looking in from the outside, those who knew him well knew exactly what was going on. It could all be traced back to a specific incident that happened exactly 5 years previously.",
  "He couldn't move. His head throbbed and spun. He couldn't decide if it was the flu or the drinking last night. It was probably a combination of both.",
  "Sleeping in his car was never the plan but sometimes things don't work out as planned. This had been his life for the last three months and he was just beginning to get used to it. He didn't actually enjoy it, but he had accepted it and come to terms with it. Or at least he thought he had. All that changed when he put the key into the ignition, turned it and the engine didn't make a sound.",
  "Do you really listen when you are talking with someone? I have a friend who listens in an unforgiving way. She actually takes every word you say as being something important and when you have a friend that listens like that, words take on a whole new meaning.",
  "He heard the crack echo in the late afternoon about a mile away. His heart started racing and he bolted into a full sprint. he repeated under his breathlessness as he continued to sprint.",
];

const Typing = () => {
  const [word, setWord] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [prevWordIdx, setPrevWordIdx] = useState(0);
  const [currentLetterIdx, setCurrentLetterIdx] = useState(-1);
  const [mistakes, setMistakes] = useState(0);
  const [wordHistory, setWordHistory] = useState<string[]>([]);

  const currentWordRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentLetterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const word = text[Math.floor(Math.random() * text.length)].split(" ");
    setWord(word);
    setCurrentWord(word[0]);
  }, []);

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

    if (input.length === 1 && !isSpace) {
      if (input === currentWord[typed.length]) {
        // resetClasses(typed.length);
        setTyped((state) => state + input);
        currentWordRef.current?.children[typed.length].classList.add("correct");
        console.log("correct");
      } else if (typed.length < currentWord.length) {
        // resetClasses(typed.length);
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
            if (childs[i].classList.length === 0) {
              childs[i].classList.add("skipped");
            }
          }
        }
      }
      setWordHistory((state) => {
        const temp = state;
        temp[currentWordIdx] = typed;
        return temp;
      });
      setCurrentWordIdx((current) => current + 1);
      setPrevWordIdx(currentWordIdx + 1);
      setCurrentWord(word[currentWordIdx + 1]);
      setTyped("");
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
        setCurrentWord(word[currentWordIdx - 1]);
        setTyped(wordHistory[currentWordIdx - 1]);
      }
    }
  };

  useEffect(() => {
    console.log(
      currentLetterRef.current,
      word[currentWordIdx],
      wordHistory[currentWordIdx],
      prevWordIdx,
      currentWordIdx
    );
    if (caretRef.current) {
      if (currentLetterRef.current) {
        console.log("normal");
        caretRef.current.style.top =
          currentLetterRef?.current?.getBoundingClientRect().top + "px";
        caretRef.current.style.left =
          currentLetterRef?.current?.getBoundingClientRect().left - 1 + "px";
      } else {
        if (currentWordIdx < prevWordIdx) {
          console.log("backing", currentWordIdx, prevWordIdx);
          caretRef.current.style.left =
            parseFloat(caretRef?.current?.style?.left) - 10 + "px";
        } else {
          console.log("last character");
          caretRef.current.style.left =
            parseFloat(caretRef?.current?.style?.left) + 10 + "px";
        }
      }
    }
  }, [typed, currentWordIdx, word, wordHistory, currentLetterRef, prevWordIdx]);

  return (
    <Center height={"100vh"} bg="#262626">
      <Container maxW="4xl">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <div
            style={{
              display: "flex",
              columnGap: "10px",
              flexWrap: "wrap",
            }}
          >
            {word.map((w, wIndex) => {
              const isActive = currentWord === w && currentWordIdx === wIndex;
              return (
                <div
                  className={`word ${isActive ? "active" : ""}`}
                  key={wIndex}
                  ref={isActive ? currentWordRef : null}
                >
                  {w.split("").map((letter, index) => {
                    const isCurrentLetter =
                      index === typed.length && currentWordIdx === wIndex;
                    return (
                      <span
                        // className={isCurrentLetter ? "current" : ""}
                        ref={isCurrentLetter ? currentLetterRef : null}
                        key={letter + " " + index}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="caret" ref={caretRef}></div>
          <Input
            onKeyDown={handleTyping}
            value={typed}
            opacity={0}
            ref={inputRef}
          />
          <pre style={{ position: "absolute", right: 50, top: 50 }}>
            {JSON.stringify(
              {
                typed,
                typedLength: typed.length,
                currentWord,
                currentWordIdx,
                prevWordIdx,
                currentLetterIdx,
                mistakes,
                currentLetter: { classes: currentLetterRef.current?.classList },
                wordHistory,
              },
              null,
              2
            )}
          </pre>
        </div>
      </Container>
    </Center>
  );
};

export default Typing;
