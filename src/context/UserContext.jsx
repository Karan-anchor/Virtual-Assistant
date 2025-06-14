import React, { createContext, useEffect, useState } from 'react';
import run from '../gemini';

export const datacontext = createContext();

function UserContext({ children }) {
  let [speaking, setspeaking] = useState(false);
  let [prompt, setprompt] = useState("listening...");
  let [response, setresponse] = useState(false);
  const [recognition, setRecognition] = useState(null);


  function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);
  text_speak.volume = 1;
  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.lang = "en-US";

  const setVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();

    // Filter for common female voices
    const femaleVoice = voices.find(voice =>
      /female|zira|samantha|google uk english female/i.test(voice.name)
    );

    text_speak.voice = femaleVoice || voices[0]; // fallback if no match
    window.speechSynthesis.speak(text_speak);
  };

  // If voices already loaded
  if (window.speechSynthesis.getVoices().length > 0) {
    setVoiceAndSpeak();
  } else {
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      setVoiceAndSpeak();
    };
  }
}


  async function aiResponse(prompt) {
    let text = await run(prompt);
    let newtext = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/google/gi, "Karan Rathor");

    setprompt(newtext);
    speak(newtext);
    setresponse(true);
    setTimeout(() => {
      setspeaking(false);
    }, 5000);
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.onresult = (e) => {
        let currentIndex = e.resultIndex;
        let transcript = e.results[currentIndex][0].transcript;
        setprompt(transcript);
        takecommand(transcript.toLowerCase());
      };

      function takecommand(command) {
        const openSites = {
          youtube: "https://www.youtube.com/",
          google: "https://www.google.com/",
          instagram: "https://www.instagram.com/",
          facebook: "https://www.facebook.com/",
          linkedin: "https://www.linkedin.com/",
          twitter: "https://www.twitter.com/",
        };

        for (let key in openSites) {
          if (command.includes("open") && command.includes(key)) {
            window.open(openSites[key], "_blank");
            speak(`opening ${key}`);
            setprompt(`opening ${key}...`);
            setTimeout(() => setspeaking(false), 5000);
            return;
          }
        }

        if (command.includes("time")) {
          let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
          speak(time);
          setresponse(true);
          setprompt(time);
          setTimeout(() => setspeaking(false), 5000);
        } else if (command.includes("date")) {
          let date = new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" });
          speak(date);
          setresponse(true);
          setprompt(date);
          setTimeout(() => setspeaking(false), 5000);
        } else {
          aiResponse(command);
        }
      }

      setRecognition(recognitionInstance);
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }
  }, []);

  let value = {
    recognition,
    speak,
    speaking,
    setspeaking,
    prompt,
    setprompt,
    response,
    setresponse
  };

  return (
    <div>
      <datacontext.Provider value={value}>
        {children}
      </datacontext.Provider>
    </div>
  );
}

export default UserContext;


