import React, { useState, useEffect } from "react";
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
import "./MainView.css";
import axios from "axios";
const MainView = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [output, setOutput] = useState("");
  const [chatContent, setChatContent] = useState("");

  async function aiCommmunicate(chatPrompt) {
    try {
      const response = await axios.get("http://localhost:8000/chat", {
        params: {
          userId: 13,
          message: chatPrompt,
        },
        responseType: "stream",
      });

      const stream = response.data;
      // Buffer to accumulate chunks that are not complete JSON objects yet
      // Loop through each chunk and display it character by character
      for await (const chunk of stream) {
        for (let i = 0; i < chunk.length; i++) {
          // Delay to simulate typewriter effect
          await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust the delay for speed

          // Update chat content with each new character
          setChatContent((prev) => prev + chunk[i]);
        }
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  }
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleTest = () => {
    console.log("test");
    chrome.runtime.sendMessage({ action: "testFunctionality" }, (response) => {
      console.log(response.status);
    });
  };

  const getDOM = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "getDOMAndURL" },
        (response) => {
          console.log(response);
        }
      );
    });
  };

  console.log("test1");

  const handleValueChange = (newValue) => {
    setTextInput(newValue);
  };

  useEffect(() => {
    if (output == "") {
      document.body.style.width = "800px";
    } else {
      document.body.style.width = "300px";
    }
  }, [output]);

  return (
    <div className="container divide-x">
      <div className="main-view" style={{ flex: output != "" ? "0.375" : "1" }}>
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
        {/* TODO: delete */}
        <div>{chatContent}</div>
        <button onClick={() => aiCommmunicate("hello")}>test button</button>
        <MicrophoneButton />

        <button className="w-5 h-4 bg-slate-100" onClick={getDOM}>
          test
        </button>

        <TypeBox
          value={textInput}
          isActive={!isProcessing}
          onValueChange={handleValueChange}
        />
      </div>
      <div className="w-2 bg-gray-300 h-full "></div>
      <div
        className="steps-view"
        style={{ display: output == "" ? "block" : "none" }}
      >
        {output}
      </div>
    </div>
  );
};

export default MainView;
