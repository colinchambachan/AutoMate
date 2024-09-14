import React, { useState, useRef } from 'react';
import Microphone from './../assets/Microphone.png';
import ListeningWave from './../assets/ListeningWave.svg';
import './MicrophoneButton.css';

const MicrophoneButton = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (!isListening){
      startRecording()
    }else{
      stopRecording()
    }
    setIsListening(!isListening);
  };


  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyserRef.current);

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
        detectSilence();
      })
      .catch(err => console.error('Error accessing microphone:', err));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  };

  const detectSilence = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkSilence = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      const total = dataArray.reduce((acc, val) => acc + val, 0);
      const average = total / dataArray.length;
      console.log('total: ' + total)
      console.log('average: ' + average)

      if (average < 10) { 
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            toggleListening();
          }, 2000);
        }
      } else {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      }

      if (recording) {
        requestAnimationFrame(checkSilence);
      }
    };

    checkSilence();
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
