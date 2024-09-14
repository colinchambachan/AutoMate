import React, { useState } from "react";
import VolumeOff from "./../assets/VolumeOff.png";
import VolumeOn from "./../assets/VolumeOn.png";
import Settings from "./../assets/Settings.png";
import Microphone from "./../assets/Microphone.png";
import ListeningWave from "./../assets/ListeningWave.svg";
import Picture from "./../assets/Picture.png";
import Button from "./../components/Button";
import Profile from "./../components/Profile";
import TypeBox from "./../components/TypeBox";
import MicrophoneButton from "./../components/MicrophoneButton";
import Step from "./../components/Step";
import "./MainView.css";

const MainView = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  console.log("test1");

  const handleTest = () => {
    console.log("Sending message to background script");

    chrome.runtime.sendMessage({ action: "performTabAction" }, (response) => {
      if (chrome.runtime.lastError) {
        // Log if there was an error sending the message
        console.error(
          "Error sending message:",
          chrome.runtime.lastError.message
        );
      } else {
        // Check if response exists and log it
        if (response && response.status) {
          console.log("Response from background:", response.status);
        } else {
          console.warn("No response received or status is undefined.");
        }
      }
    });
  };

  return (
    <div className="main-view">
      <Button
        icon={isMuted ? VolumeOn : VolumeOff}
        altText="Mute"
        onClick={handleTest}
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

      <Profile picture={Picture} name="Your Name" />

      <MicrophoneButton />

      <div className="steps-view">
        <Step
          isActive={true}
          title="Step 1 Title"
          description="Step 1 Description"
        />
        <Step
          isActive={false}
          title="Step 2 Title"
          description="Step 2 Description"
        />
      </div>

      <TypeBox value={textInput} isActive={!isProcessing} />
    </div>
  );
};

export default MainView;
