import React, { useState, useEffect } from 'react';
import VolumeOff from "./../assets/VolumeOff.png";
import VolumeOn from "./../assets/VolumeOn.png";
import Settings from "./../assets/Settings.png";
import Microphone from "./../assets/Microphone.png";
import ListeningWave from "./../assets/ListeningWave.svg";
import Picture from "./../assets/Picture.png";
import Button from './../components/Button';
import Profile from './../components/Profile';
import TypeBox from './../components/TypeBox';
import MicrophoneButton from './../components/MicrophoneButton';
import './MainView.css';

const MainView = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [output, setOutput] = useState('');

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleValueChange = (newValue) => {
    setTextInput(newValue);
  };


  useEffect(() => {
    if (output !== '') {
      document.body.style.width = '600px';
    } else {
      document.body.style.width = '300px';
    }
  }, [output]);

  return (
    <div className="container">
      <div className="main-view" style={{flex: output != '' ? '0.5' : '1'}}>
        <Button 
          icon={isMuted ? VolumeOn : VolumeOff} 
          altText="Mute" 
          onClick={toggleMute} 
          isActive={isMuted} 
          isRight={false}
        />
        <Button 
          icon={Settings} 
          altText="Settings" 
          onClick={toggleSettings} 
          isActive={isSettingsOpen} 
          isRight={true}
        />

        <Profile 
          picture={Picture} 
          name="Your Name" 
        />

        <MicrophoneButton />

        <TypeBox 
          value={textInput}
          isActive={!isProcessing} 
          onValueChange={handleValueChange}
        />
      </div>

      <div className="steps-view" style={{display: output !== '' ? 'block' : 'none'}}> 
        {output}
      </div>
    </div>
  );
};

export default MainView;
