import React, { memo } from "react";

interface IProps {
  word: string[];
  currentWord: string;
  currentWordIdx: number;
  currentWordRef: any;
  typed: string;
  currentLetterRef: any;
}
const Words = ({
  word,
  currentWord,
  currentWordIdx,
  typed,
  currentWordRef,
  currentLetterRef,
}: IProps) => {
  return (
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
              const currentLetterIndex =
                typed.length - 1 === -1 ? 0 : typed.length - 1;
              const isCurrentLetter =
                index === currentLetterIndex && currentWordIdx === wIndex;
              return (
                <span
                  className="single_letter"
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
  );
};

export default memo(Words);
