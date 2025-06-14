import React, { useContext} from 'react';
import "./App.css";
import va from "./assets/ai.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from './context/UserContext';
import speakimg from "./assets/speak.gif"
import aivoice from "./assets/aiVoice.gif"
function App() {
  const { recognition, speak,speaking,setspeaking,prompt,response,setprompt,setresponse} = useContext(datacontext);

  return (
    <div className='main'>
      <img src={va} alt="" id="Nexus" />
      <span>I'm Nexus, Your Advanced Virtual Assistant</span>

     {!speaking? 
     <button onClick={() => {
          if (recognition) {
             window.speechSynthesis.getVoices();
            setprompt("listening...")
            setspeaking(true)
            setresponse(false)
            recognition.start();
          } 
          // else {
          //   alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
          // }
        }}
       >
        Click here <CiMicrophoneOn />
        </button>
      :
      <div className='response'>
      {!response?  
      <img src={speakimg} alt="" id='speak'/>
      :
       <img src={aivoice} alt="" id='aivoice'/>
      }
     
      <p>{prompt}</p>
      </div>

      }
    </div>
  );
}

export default App;

