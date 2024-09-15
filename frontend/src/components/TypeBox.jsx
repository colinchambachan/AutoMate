import React, { useState } from "react";
import "./TypeBox.css";
import TypeIcon from "./../assets/TypeIcon.png";

const TypeBox = ({ value, onValueChange, isActive }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    onValueChange(event.target.value);
  };

  return (
    <div className={`type-box ${isActive ? "" : "processing"}`}>
      <img src={TypeIcon} alt="Type Icon" className="type-icon" />
      <input
        value={value}
        type="text"
        className="type-input"
        placeholder={isActive ? "Type your message..." : "Processing information..."}
        onChange={handleChange}
      />
    </div>
  );
};

export default TypeBox;
