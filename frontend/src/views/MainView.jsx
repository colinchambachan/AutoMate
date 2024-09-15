import React, { useState, useEffect } from "react";
import VolumeOff from "./../assets/VolumeOff.png";
import VolumeOn from "./../assets/VolumeOn.png";
import Settings from "./../assets/Settings.png";
import Microphone from "./../assets/Microphone.png";
import ListeningWave from "./../assets/ListeningWave.svg";
import Picture from "./../assets/logo-bg-dark.png";
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
  // const [output, setOutput] = useState("");
  const [chatContent, setChatContent] = useState("");
  const [isFinishedGenerating, setIsFinishedGenerating] = useState(false);

  async function getHtmlDomAndUrl() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (chrome.runtime.lastError) {
          console.error("Error in tabs.query:", chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
          return;
        }

        const activeTab = tabs[0];
        if (!activeTab) {
          const error = new Error("No active tab found.");
          console.error(error);
          reject(error);
          return;
        }

        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "getDOMAndURL" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error in sendMessage:", chrome.runtime.lastError);
              reject(chrome.runtime.lastError);
            } else if (!response) {
              const error = new Error("No response from content script.");
              console.error(error);
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      });
    });
  }

  function cleanHtmlDom(htmlString) {
    // Parse the HTML string into a DOM object
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Remove unwanted tags: <script>, <style>, <link>, <iframe>, <svg>, <img>
    const elementsToRemove = [
      "script",
      "style",
      "link",
      "iframe",
      "svg",
      "img",
    ];
    elementsToRemove.forEach((tag) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((element) => element.remove());
    });

    // Remove inline styles
    doc
      .querySelectorAll("[style]")
      .forEach((element) => element.removeAttribute("style"));

    // Remove class attributes
    doc
      .querySelectorAll("[class]")
      .forEach((element) => element.removeAttribute("class"));

    // Serialize the cleaned DOM back into a string
    const cleanedHtmlString = doc.documentElement.outerHTML;

    return cleanedHtmlString;
  }

  async function aiCommmunicate(chatPrompt) {
    while (true) {
      // Make request to context API to get HTML DOM and URL
      let htmlDOM = "";
      let currentURL = "";

      const res = await getHtmlDomAndUrl();

      if (res) {
        htmlDOM = res.htmlDOM;
        currentURL = res.currentURL;
      } else {
        console.error("Error getting htmlDOM and currentURL");
        break;
      }
      let cleanedHtmlDom = cleanHtmlDom(htmlDOM);
      try {
        setIsFinishedGenerating(false);
        const response = await axios.post(
          "http://localhost:8000/chat",
          {
            userId: 13,
            message: chatPrompt,
            htmlDOM: cleanedHtmlDom,
            currentURL,
          },
          {
            responseType: "stream",
          }
        );

        const stream = response.data;
        // Buffer to accumulate chunks that are not complete JSON objects yet
        // Loop through each chunk and display it character by character
        for await (const chunk of stream) {
          for (let i = 0; i < chunk.length; i++) {
            // Delay to simulate typewriter effect
            await new Promise((resolve) => setTimeout(resolve, 20)); // Adjust the delay for speed

            // Update chat content with each new character
            setChatContent((prev) => prev + chunk[i]);
          }
        }

        setIsProcessing(false);
        setIsFinishedGenerating(true);
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
        setIsFinishedGenerating(false);
        console.error("Error fetching chat data:", error);
        break;
      }

      if (chatPrompt == "DONE") {
        console.log("DONE Operation!!!!!!!!!");
        break;
      }
    }
  }

  useEffect(() => {
    async function wait() {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    if (!isFinishedGenerating || !chatContent || chatContent === "") return;

    // Perform the action on the runtime
    try {
      const actions = JSON.parse(chatContent);

      for (const act of actions) {
        chrome.runtime.sendMessage({
          action: "performAction",
          perform: act,
        });
      }
      setChatContent("");
      wait();
    } catch (e) {
      setChatContent("");
      return;
    }
  }, [isFinishedGenerating, chatContent]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleValueChange = (newValue) => {
    setTextInput(newValue);
  };

  const submitPrompt = () => {
    aiCommmunicate(textInput);
    setIsProcessing(true);
  };

  useEffect(() => {
    if (chatContent !== "") {
      document.body.style.width = "800px";
    } else {
      document.body.style.width = "300px";
    }
  }, [chatContent]);

  return (
    <div className="container divide-x">
      <div
        className="main-view"
        style={{ flex: chatContent != "" ? "0.375" : "1" }}
      >
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

        <Profile picture={Picture} name="Grandma Suzy" />

        <MicrophoneButton
          value={textInput}
          onValueChange={handleValueChange}
          setIsProcessing={setIsProcessing}
          isProcessing={isProcessing}
          promptSubmit={submitPrompt}
        />

        <TypeBox
          value={textInput}
          isActive={!isProcessing}
          onValueChange={handleValueChange}
          promptSubmit={submitPrompt}
        />
      </div>
      <div
        className="steps-view"
        style={{ display: chatContent !== "" ? "block" : "none" }}
      >
        {chatContent}
      </div>
    </div>
  );
};

export default MainView;
