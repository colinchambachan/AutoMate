import React, { useEffect, useState } from "react";
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
import axios from "axios";

const MainView = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [chatContent, setChatContent] = useState("");
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
  // let tempBuffer = "";
  // const updateUIWithChunk = (chunk) => {
  //   // Append the chunk to the buffer
  //   tempBuffer += chunk;

  //   // Process complete JSON objects from the buffer
  //   let endOfMessageIndex;
  //   while ((endOfMessageIndex = tempBuffer.indexOf("\n")) >= 0) {
  //     const messageChunk = tempBuffer.substring(0, endOfMessageIndex).trim();
  //     tempBuffer = tempBuffer.substring(endOfMessageIndex + 1);

  //     if (messageChunk) {
  //       try {
  //         const json = JSON.parse(messageChunk);
  //         if (json.eventType === "text-generation" && json.text) {
  //           setChatContent((prev) => prev + json.text);
  //         }
  //       } catch (error) {
  //         console.error("Error parsing JSON:", error);
  //       }
  //     }
  //   }
  // };

  async function testFetch() {
    try {
      const response = await axios.get("http://localhost:8000/chat", {
        params: {
          userId: 13,
          message: "send an email to John using gmail",
        },
        responseType: "stream",
      });

      const stream = response.data;
      for await (const chunk of stream) {
        setChatContent((prev) => prev + chunk);
      }

      console.log(3);
      // Start reading the stream
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  }
  useEffect(() => console.log(chatContent), [chatContent]);

  return (
    <div className="main-view">
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

      <Profile picture={Picture} name="Your Name" />
      <div className="chat-output">{"test step view now" + chatContent}</div>
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
      <button
        onClick={() => {
          testFetch();
        }}
      >
        test button
      </button>
      <TypeBox
        value={textInput}
        isActive={!isProcessing}
        onValueChange={handleValueChange}
      />
    </div>
  );
};

export default MainView;
