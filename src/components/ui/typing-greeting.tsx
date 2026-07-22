"use client";

import React, { useEffect, useState } from "react";

const GREETINGS = [
  { text: "Hello", lang: "en" },
  { text: "こんにちは", lang: "ja" },
  { text: "Hola", lang: "es" },
  { text: "Bonjour", lang: "fr" },
  { text: "你好", lang: "zh" },
  { text: "안녕하세요", lang: "ko" },
  { text: "Hallo", lang: "de" },
  { text: "Ciao", lang: "it" },
  { text: "Olá", lang: "pt" },
  { text: "Xin chào", lang: "vi" },
  { text: "สวัสดี", lang: "th" },
];

export function TypingGreeting() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorTimeout = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(cursorTimeout);
  }, [blink]);

  // Typing effect
  useEffect(() => {
    if (subIndex === GREETINGS[index].text.length + 1 && !reverse) {
      // Pause at the end of word before reversing
      const timeout = setTimeout(() => setReverse(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      const timeout = setTimeout(() => {
        setReverse(false);
        setIndex((prev) => (prev + 1) % GREETINGS.length);
      }, 500); // Pause briefly before typing the next word
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150); // Speed up backspacing

    return () => clearTimeout(timeout);
  }, [subIndex, reverse, index]);

  return (
    <div className="inline-flex items-center gap-1.5 text-lg md:text-xl font-bold text-black mb-4 min-h-[30px]">
      <span className="bg-[#01e1d4]/20 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
        {GREETINGS[index].lang}
      </span>
      <span className="tracking-tight">
        {GREETINGS[index].text.substring(0, subIndex)}
      </span>
      <span
        className={`inline-block w-[2px] h-[1.25em] bg-black transition-opacity duration-100 ${
          blink ? "opacity-100" : "opacity-0"
        }`}
        style={{ verticalAlign: "middle" }}
      />
    </div>
  );
}
