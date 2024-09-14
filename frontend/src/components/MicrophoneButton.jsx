import React, { useState } from 'react';
import Microphone from './../assets/Microphone.png';
import ListeningWave from './../assets/ListeningWave.svg';
import './MicrophoneButton.css';

const MicrophoneButton = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className={`microphone-button ${isListening ? 'listening' : ''}`} onClick={toggleListening}>
      <img
        src={isListening ? Microphone : Microphone}
        alt={isListening ? 'Listening' : 'Microphone'}
        className={`microphone-icon ${isListening ? 'listening' : ''}`}
      />
    </div>
  );
};

export default MicrophoneButton;
