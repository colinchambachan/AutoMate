import React, { useState, useRef } from 'react';
import Microphone from './../assets/Microphone.png';
import ListeningWave from './../assets/ListeningWave.svg';
import './MicrophoneButton.css';

const MicrophoneButton = ({ value, onValueChange, setIsProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event) => {
    setInputValue(event);
    onValueChange(event);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening){
      setIsProcessing(true)
      startRecording()
    } else{
      setIsProcessing(false)
      stopRecording()
    }
  };


  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const silenceThreshold = 0.01; // Adjust this value to control sensitivity to silence
  const silenceDelay = 3000; 

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = event => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/m4a' });
          sendAudioToAPI(audioBlob);
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.start();
        setRecording(true);

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048; 

        source.connect(analyserRef.current);

        detectSilence();
      })
      .catch(err => console.error('Error accessing microphone:', err));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    clearTimeout(silenceTimeoutRef.current);
  };

  const detectSilence = () => {
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const checkForSilence = () => {
      analyserRef.current.getByteTimeDomainData(dataArray);

      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalizedValue = (dataArray[i] - 128) / 128;
        sumSquares += normalizedValue * normalizedValue;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);


      if (rms < silenceThreshold) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            toggleListening();
            console.log('Current volume:', rms);
          }, silenceDelay);
        }
      } else {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      if (!isListening) {
        requestAnimationFrame(checkForSilence);
      }
    };

    checkForSilence();
  };


  const sendAudioToAPI = (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.m4a');
    formData.append('model', 'distil-whisper-large-v3-en');

    fetch('https://api.groq.com/openai/v1/audio/transcriptions', { 
      method: 'POST',
      body: formData,
      headers: {
        'model': "distil-whisper-large-v3-en",
        'Authorization': 'Bearer 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', 
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('Transcription:', data.text);
      handleChange(data.text);
    })
    .catch(error => console.error('Error:', error));
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
