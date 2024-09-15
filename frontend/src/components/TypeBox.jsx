import React, { useState } from "react";
import "./TypeBox.css";
import TypeIcon from "./../assets/TypeIcon.png";
import RightArrowIcon from "./../assets/RightArrow.png";

const TypeBox = ({ value, onValueChange, isActive, promptSubmit }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    onValueChange(event.target.value);
  };

  return (
    <div className={`type-box ${isActive ? "" : "processing"}`}>
      <img src={TypeIcon} alt="Type Icon" className="submit-icon" />
      <input
        value={value}
        type="text"
        className="type-input"
        placeholder={
          isActive ? "Type your message..." : "Processing information..."
        }
        onChange={handleChange}
      />
      <img
        src={RightArrowIcon}
        alt="Submit Icon"
        className="submit-icon cursor-pointer"
        onClick={promptSubmit}
      />
    </div>
  );
};

export default TypeBox;
